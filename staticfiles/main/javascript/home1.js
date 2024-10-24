function switchTab(category) {
    const mainContent = document.getElementById('trading-options');
    mainContent.innerHTML = `<p>Loading ${category} data...</p>`;
    
    // Fetch and display data for the selected category
    // This can be replaced with an actual API call or data retrieval logic
    setTimeout(() => {
        mainContent.innerHTML = `<p>Here are the trading options for ${category}:</p>`;
        // Example data for demonstration purposes
        const exampleData = [
            'Option 1',
            'Option 2',
            'Option 3',
            'Option 4',
        ];
        const list = document.createElement('ul');
        exampleData.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            list.appendChild(listItem);
        });
        mainContent.appendChild(list);
    }, 1000); // Simulate a delay for data fetching
}

