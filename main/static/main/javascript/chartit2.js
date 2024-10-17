class ChartManager {
    constructor() {
        this.chart = null;
        this.klines = null;
        this.candleseries = null;
        this.domElement = document.getElementById("tvchart");
        this.initializeChart();
        this.loadData();
    }

    initializeChart() {
        const chartProperties = {
            timeScale: {
                timeVisible: true,
            },
        };

        // Create a new chart instance
        this.chart = LightweightCharts.createChart(
            this.domElement,
            chartProperties
        );

        // Add a candlestick series to the chart
        this.candleseries = this.chart.addCandlestickSeries();
    }

    loadData() {
	    const urlPath = window.location.pathname;
    const parts = urlPath.split('/');
    const symbol = parts[2];

    fetch(`/get_data/${symbol}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Parse JSON asynchronously
            })
            .then(data => {
                console.log("Received data:", data);
		const parsedData = JSON.parse(data.data); 

                // Check if 'data.data' is an array
                if (!Array.isArray(parsedData)) {
                    throw new TypeError("Data format error: Expected data to be an array.");
                }

                // Map 'data.data' to 'this.klines' for candlestick series
                this.klines = parsedData.map((item) => ({
                    time: Math.floor(new Date(item.Date).getTime() / 1000),
                    open: item.Open,
                    high: item.High,
                    low: item.Low,
                    close: item.Close,
                }));

                console.log("Parsed klines:", this.klines);

                // Set data to candlestick series
                this.candleseries.setData(this.klines);
            })
            .catch(error => {
                console.error("Error fetching or parsing data:", error);
            });
    }
}

// Create an instance of ChartManager
const chartManager = new ChartManager();

