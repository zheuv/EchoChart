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


