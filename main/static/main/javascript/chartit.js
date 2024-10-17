document.addEventListener('DOMContentLoaded', function() {
    const urlPath = window.location.pathname;
    const parts = urlPath.split('/');
    const symbol = parts[2];

    fetch(`/get_data/${symbol}/`)
        .then(response => response.json())
        .then(data => {
            const parsedData = JSON.parse(data.data);

            const labels = parsedData.map(item => {
                const date = new Date(item.Date);
                console.log('Parsed Date:', date); // Debugging the date parsing
                return date;
            });

            const values = parsedData.map(item => item.Close);

            console.log('Labels:', labels);
            console.log('Values:', values);

            const canvas = document.getElementById('myChart');
            if (!canvas) {
                console.error('Canvas element with id "myChart" not found.');
                return;
            }

            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${symbol} Closing Prices`,
                        data: values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day', // You can adjust the unit to 'minute', 'hour', 'day', 'week', 'month', etc.
                                tooltipFormat: 'll HH:mm' // Adjust the tooltip format as needed
                            },
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                text: 'Close Price'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching chart data:', error);
        });
});

