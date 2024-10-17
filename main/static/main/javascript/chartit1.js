document.addEventListener('DOMContentLoaded', function() {
    const urlPath = window.location.pathname;
    const parts = urlPath.split('/');
    const symbol = parts[2];

    fetch(`/get_data/${symbol}/`)
        .then(response => response.json())
        .then(data => {
            const parsedData = JSON.parse(data.data);
            const cdata = parsedData.map(item => ({
                time: new Date(item.Date), // Convert to UNIX timestamp in seconds
                open: item.Open,
                high: item.High,
                low: item.Low,
                close: item.Close
            }));

            const log = console.log;

            const chartProperties = {
                width: 1500,
                height: 600,
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                }
            };

            const domElement = document.getElementById('myChart');
            const chart = LightweightCharts.createChart(domElement, chartProperties);
            const candleSeries = chart.addCandlestickSeries();
            candleSeries.setData(cdata);
        })
        .catch(err => console.log(err));
});

