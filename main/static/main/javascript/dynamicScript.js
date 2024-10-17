document.addEventListener('DOMContentLoaded', function() {
	const timeFrame = document.getElementById("timeFrame");
	const urlPath = window.location.pathname;
    const parts = urlPath.split('/');	
	timeFrame.textContent = parts[4];		
});
document.addEventListener('DOMContentLoaded', function() {
    const timeFrame = document.getElementById('timeFrame');
    const timeFrameSuggestions = document.getElementById('timeFrameSuggestions');
    
    // Show suggestions on click
    timeFrame.addEventListener('click', function() {
        timeFrameSuggestions.style.display = (timeFrameSuggestions.style.display === 'none' || timeFrameSuggestions.style.display === '') ? 'block' : 'none';
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(event) {
        if (!timeFrame.contains(event.target) && !timeFrameSuggestions.contains(event.target)) {
            timeFrameSuggestions.style.display = 'none';
        }
    });

    // Handle selection of a timeframe option
    const timeFrameOptions = document.querySelectorAll('.timeFrame-option');
    timeFrameOptions.forEach(option => {
        option.addEventListener('click', function() {
            timeFrame.textContent = option.textContent;
            timeFrameSuggestions.style.display = 'none'; // Hide suggestions after selection
        });
    });
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
