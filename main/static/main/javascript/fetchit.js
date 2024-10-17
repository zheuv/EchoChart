function fetchit(category) {
    const Content = document.getElementById(category);
    const categoryName = category.replace('-options', '');
    Content.innerHTML = `<p>Loading ${categoryName} data...</p>`;

    // Fetch data for the selected category from the API
    fetch(`/currency-pairs/`)
        .then(response => response.json())
        .then(data => {
            Content.innerHTML = `<p>Here are the trading options for ${categoryName}:</p>`;

            // Create a table
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
                if (pair.type === categoryName) {
                    const row = document.createElement('tr');

                    const nameCell = document.createElement('td');
                    nameCell.textContent = pair.name;

                    const launchButton = document.createElement('button');
                    launchButton.classList.add('launch');
                    launchButton.innerHTML = 'Launch Chart';
                    launchButton.addEventListener('click', () => {
                        window.location.href = `/chart/${pair.symbol}`; // Update with your URL pattern
                    });
                    nameCell.appendChild(launchButton);

                    const backtestButton = document.createElement('button');
                    backtestButton.classList.add('backtestChart');
                    backtestButton.innerHTML = "Backtest Chart";
                    backtestButton.dataset.symbol = pair.symbol; // Store symbol in data attribute
                    backtestButton.dataset.type = pair.type; // Store type in data attribute
                    nameCell.appendChild(backtestButton);

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
            Content.appendChild(table);

            // Add event listeners to the new backtest buttons
            const backtestButtons = document.getElementsByClassName('backtestChart');
            const modal = document.getElementById('backtestModal');
            const closeModal = document.getElementsByClassName('close')[0];
            const backtestForm = document.getElementById('backtestForm');
            let selectedSymbol, selectedType;

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

            backtestForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                const timeframe = document.getElementById('timeframe').value;

                console.log('Backtest Parameters:', { startDate, endDate, timeframe });

                const backtestUrl = `/backtest_chart/${selectedSymbol}/${selectedType}/${timeframe}/${startDate}/${endDate}/`;
                console.log('Backtest URL:', backtestUrl);

                // Trigger the backtest request by redirecting to the URL
                window.location.href = backtestUrl;

                modal.style.display = 'none';
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            Content.innerHTML = `<p>Error loading ${categoryName} data. Please try again later.</p>`;
        });
}

