document.addEventListener('DOMContentLoaded', function() {
	const tradingOptions = document.getElementById('trading-options');
    	tradingOptions.innerHTML = `<p>Loading ${category} data...</p>`;
	setTimeout(() => {
		tradingOptions.innerHTML = `<p>Here are the trading options for ${category}:</p>`;
		fetch('/currency-pairs/')
			.then(response => response.json())
			.then(data => {
				tradingOptions.innerHTML = '';  // Clear previous options
				data.forEach(pair => {
					let option = document.createElement('div');
					option.textContent = pair.name;
					tradingOptions.appendChild(option);
					});
				});
			});
});

