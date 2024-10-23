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
            tradingOptions = data;  // Store the full JSON objects
        })
        .catch(error => {
            console.error('Error fetching trading options:', error);
        });

    // Filter and display suggestions based on user input
    searchBar.addEventListener('input', function() {
        const input = searchBar.value.toLowerCase();
        suggestionsContainer.innerHTML = '';

        if (input) {
            const filteredOptions = tradingOptions.filter(option => option.name.toLowerCase().includes(input));

            filteredOptions.forEach(option => {
                // Create a suggestion container div
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');

                // Create a span for the option name
                const optionSpan = document.createElement('span');
                optionSpan.textContent = option.name;

                // Create the "Chart on the same period" button
				
				const choosePeriod = document.createElement('button');
				choosePeriod.textContent = "backTest chart";
				choosePeriod.classList.add('period-button');
				choosePeriod.dataset.symbol = option.symbol; // Store symbol in data attribute
				choosePeriod.dataset.type = option.type;
                
                // Append optionSpan and chartButton to the suggestion item
                suggestionItem.appendChild(optionSpan);
				suggestionItem.appendChild(choosePeriod);
                
                suggestionsContainer.appendChild(suggestionItem);

                // Handle click event on suggestion item
                optionSpan.addEventListener('click', function() {
                    searchBar.value = option.name;
                    suggestionsContainer.innerHTML = '';
                });

                // Handle click event for the chart button
                choosePeriod.addEventListener('click', function() {
                    populateBacktestButtons('period-button');  // Function to trigger charting the option
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

