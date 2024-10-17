function openCategory(evt, categoryName) {
    var i, content, tabs;

    // Hide all category content
    content = document.getElementsByClassName("category-content");
    for (i = 0; i < content.length; i++) {
        content[i].style.display = "none";
    }

    // Remove active class from all tabs
    tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(" active", "");
    }

    // Show the current category content and add active class to the clicked tab
    document.getElementById(categoryName).style.display = "block";
    evt.currentTarget.className += " active";

    // Fetch data for the selected category
    fetchit(categoryName + '-options');
}
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
		    nameCell.appendChild(launchButton);

		    const backtestButton = document.createElement('button');
	       	    backtestButton.classList.add('backtest');
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
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            Content.innerHTML = `<p>Error loading ${categoryName} data. Please try again later.</p>`;
        });
}


document.addEventListener('DOMContentLoaded', function() {
    // Initial load can be for a default category
    openCategory(event, 'Indices');
});
document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const suggestionsContainer = document.getElementById('suggestions');
    let tradingOptions = [];

    // Fetch all trading options
    fetch('/currency-pairs/')
        .then(response => response.json())
        .then(data => {
            tradingOptions = data.map(pair => pair.name);
        })
        .catch(error => {
            console.error('Error fetching trading options:', error);
        });

    // Filter and display suggestions based on user input
    searchBar.addEventListener('input', function() {
        const input = searchBar.value.toLowerCase();
        suggestionsContainer.innerHTML = '';

        if (input) {
            const filteredOptions = tradingOptions.filter(option => option.toLowerCase().includes(input));
            filteredOptions.forEach(option => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.textContent = option;
                suggestionsContainer.appendChild(suggestionItem);

                // Handle click event on suggestion item
                suggestionItem.addEventListener('click', function() {
                    searchBar.value = option;
                    suggestionsContainer.innerHTML = '';
                });
            });
        }
    });

    // Handle click outside the suggestions container to close it
    document.addEventListener('click', function(event) {
        if (!searchBar.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.innerHTML = '';
        }
    });
});

