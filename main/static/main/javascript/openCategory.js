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

    if (categoryName !== "favorites") {
        evt.currentTarget.className += " active";
        fetchit(categoryName + '-options');
    } else {
        openFavorites(categoryName + '-options');
    }
}


async function openFavorites(category) {
    const Content = document.getElementById(category);
    Content.innerHTML = `<p>Loading ${category} assets data...</p>`;
    
    try {
        const response = await fetch('/get-favorites/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        Content.innerHTML = `<p>Here are the trading options for favorites:</p>`;
        
        if (data.fav_pairs && data.fav_pairs.length > 0) {
            const favoritesSet = await fetchFavorites(); // Wait for favorites to be fetched
            const table = createTable(data.fav_pairs, "favorites", favoritesSet);
            Content.appendChild(table);
            
            // Populate backtest buttons and add event listeners
            populateBacktestButtons('backtestChartTable');
            populateFavoritesButtons();
        } else {
            alert('No favorite assets found.');
        }
    } catch (error) {
        console.error('Error fetching favorites:', error);
        Content.innerHTML = `<p>Error loading favorites data. Please try again later.</p>`;
    }
}
