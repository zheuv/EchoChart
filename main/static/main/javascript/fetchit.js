async function fetchFavorites() {
    let favoritesSet = new Set();

    try {
        const response = await fetch('/get-favorites/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const favoritesData = await response.json();
        // Populate the Set with favorite pairs
        favoritesSet = new Set(favoritesData.fav_pairs.map(pair => `${pair.name}|${pair.symbol}|${pair.type}`));
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }

    return favoritesSet; // Return the Set
}

function createTable(data, categoryName, favoritesSet) {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Name', 'Symbol', 'Type']; // Adjust the headers as needed
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f2f2f2';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');
    data.forEach(pair => {
        if (pair.type === categoryName || categoryName === "favorites") {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = pair.name;

            const backtestButton = document.createElement('button');
            backtestButton.classList.add('backtestChartTable');
            backtestButton.innerHTML = "Backtest Chart";
            backtestButton.dataset.symbol = pair.symbol; // Store symbol in data attribute
            backtestButton.dataset.type = pair.type; // Store type in data attribute
            nameCell.appendChild(backtestButton);
            
            const favoritesButton = document.createElement('button');
            favoritesButton.classList.add('fav-btn');
            if (favoritesSet.has(`${pair.name}|${pair.symbol}|${pair.type}`)) {
                favoritesButton.innerHTML = "Added!";
            } else {
                favoritesButton.innerHTML = "Add to Favorites"; // Default to "Add to Favorites"
            }
            favoritesButton.dataset.name = pair.name;
            favoritesButton.dataset.symbol = pair.symbol; // Store symbol in data attribute
            favoritesButton.dataset.type = pair.type; // Store type in data attribute
            nameCell.appendChild(favoritesButton);

            row.appendChild(nameCell);

            const symbolCell = document.createElement('td');
            symbolCell.textContent = pair.symbol; // Adjust according to your data structure
            row.appendChild(symbolCell);

            const typeCell = document.createElement('td');
            typeCell.textContent = pair.type; // Adjust according to your data structure
            row.appendChild(typeCell);

            tbody.appendChild(row);
        }
    });

    table.appendChild(tbody);
    return table;
}





function populateBacktestButtons(classname) {
    const backtestButtons = document.getElementsByClassName(classname);
    const modal = document.getElementById('backtestModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const backtestForm = document.getElementById('backtestForm');
    let selectedSymbol, selectedType;

    // Attach the form submission handler once
    backtestForm.removeEventListener('submit', handleBacktestSubmit);
    backtestForm.addEventListener('submit', handleBacktestSubmit);

    Array.from(backtestButtons).forEach(button => {
        button.addEventListener('click', function() {
            selectedSymbol = this.dataset.symbol;
            selectedType = this.dataset.type;
            modal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Define the backtest submit handler separately to avoid redeclaring it multiple times
    function handleBacktestSubmit(event) {
        event.preventDefault();

        // Check if selectedSymbol and selectedType are set
        if (!selectedSymbol || !selectedType) {
            console.error('No symbol or type selected!');
            return; // Exit early if not set
        }

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const timeframe = document.getElementById('timeframe').value;

        console.log('Backtest Parameters:', { startDate, endDate, timeframe });

        const backtestUrl = `/backtest_chart/${selectedSymbol}/${selectedType}/${timeframe}/${startDate}/${endDate}/`;
        console.log('Backtest URL:', backtestUrl);

        // Trigger the backtest request by redirecting to the URL
        window.location.href = backtestUrl;

        modal.style.display = 'none';
    }
}



async function fetchit(category) {
    const Content = document.getElementById(category);
    const categoryName = category.replace('-options', '');
    Content.innerHTML = `<p>Loading ${categoryName} data...</p>`;

    // Fetch data for the selected category from the API
    try {
        const response = await fetch(`/currency-pairs/`);
        const data = await response.json();
        Content.innerHTML = `<p>Here are the trading options for ${categoryName}:</p>`;

        // Fetch the favorites asynchronously
        const favoritesSet = await fetchFavorites(); // Wait for the favorites set to be populated
        console.log(favoritesSet);

        const table = createTable(data, categoryName, favoritesSet);
        Content.appendChild(table);

        // Populate backtest buttons and add event listeners
        populateBacktestButtons('backtestChartTable');
        populateFavoritesButtons();
    } catch (error) {
        console.error('Error fetching data:', error);
        Content.innerHTML = `<p>Error loading ${categoryName} data. Please try again later.</p>`;
    }
}
