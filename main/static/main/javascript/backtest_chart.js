class ChartManager {
  constructor() {
    this.chart = null;
    this.xspan = null;
	this.klines = [];
	this.smaData = [];
    this.emaData = [];
    this.rsiData = [];
    this.startPoint = null;
    this.lineSeries = null;
    this.isUpdatingLine = false;
    this.isDragging = false;
	this.isLineMode = false;
	this.hoveredLine = null;
    this.dragStartPoint = null;
    this.dragStartLineData = null;
    this.lastCrosshairPosition = null;
    this.candleseries = null;
    this.selectedPoint = null; //null/0/1
    this.hoverThreshold = 0.01;
	this.highestValue = -Infinity;
	this.lowestValue = Infinity;
    this.domElement = document.getElementById("tvchart");
	this.diagonalButton = document.getElementById("diagonal");
	this.crossHairButton = document.getElementById("crosshair");
	this.lineButton = document.getElementById("line");
	this.smaButton = document.getElementById("sma");
	this.emaButton = document.getElementById("ema");
	this.timeFrameOptions = document.querySelectorAll('.timeFrame-option');
	this.boundHandleChartClick = this.handleChartClick.bind(this);
	this.boundHandleCrosshairMove = this.handleCrosshairMove.bind(this);
	this.boundHandleMouseDown = this.handleMouseDown.bind(this);
	this.boundHandleMouseUp = this.handleMouseUp.bind(this);
	this.boundDrawVerticalLine = this.drawVerticalLine.bind(this);
    this.initializeChart();
    this.subscribeToEvents();
    this.loadData();
  }

  initializeChart() {
    const chartProperties = {
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
      },
    };
    this.chart = LightweightCharts.createChart(
      this.domElement,
      chartProperties
    );
    this.candleseries = this.chart.addCandlestickSeries();
    this.lineSeriesArray = [];
	this.updateLineSeries = this.chart.addLineSeries();
  }

  subscribeToEvents() {
	this.timeFrameOptions.forEach(option => {
        option.addEventListener('click', () => {  // Arrow function preserves `this`
            const urlPath = window.location.pathname;
			const parts = urlPath.split('/');
			const selectedTimeFrame = option.textContent.trim();
            const backtestUrl = `/backtest_chart/${parts[2]}/${parts[3]}/${selectedTimeFrame}/${parts[5]}/${parts[6]}/`;
			console.log('Backtest URL:', backtestUrl);

			// Trigger the backtest request by redirecting to the URL
			window.location.href = backtestUrl;
        });
    });
	this.diagonalButton.addEventListener("click", () => { 
		// Toggle line mode
		// Enable event listeners when in line mode
		this.crossHairButton.style.backgroundColor = "transparent";
		this.lineButton.style.backgroundColor = "transparent";
		this.diagonalButton.style.backgroundColor = "#e6e6e6";
		this.smaButton.style.backgroundColor = "transparent";
		this.emaButton.style.backgroundColor = "transparent";
		this.chart.subscribeClick(this.boundHandleChartClick);
		this.chart.subscribeCrosshairMove(this.boundHandleCrosshairMove);
		this.domElement.addEventListener("mousedown", this.boundHandleMouseDown);
		this.domElement.addEventListener("mouseup", this.boundHandleMouseUp);
		this.chart.unsubscribeClick(this.boundDrawVerticalLine);
		console.log("Diagonal mode activated.");
	});
	this.crossHairButton.addEventListener("click", () => {
		// Unsubscribe using the stored bound references
		this.diagonalButton.style.backgroundColor = "transparent";
		this.lineButton.style.backgroundColor = "transparent";
		this.crossHairButton.style.backgroundColor = "#e6e6e6";
		this.smaButton.style.backgroundColor = "transparent";
		this.emaButton.style.backgroundColor = "transparent";
		this.chart.unsubscribeClick(this.boundHandleChartClick);
		this.chart.unsubscribeCrosshairMove(this.boundHandleCrosshairMove);
		this.domElement.removeEventListener("mousedown", this.boundHandleMouseDown);
		this.domElement.removeEventListener("mouseup", this.boundHandleMouseUp);
		this.chart.unsubscribeClick(this.boundDrawVerticalLine);
		console.log("Crosshair mode activated.");
	});
	this.lineButton.addEventListener("click", () => {
		this.diagonalButton.style.backgroundColor = "transparent";
		this.crossHairButton.style.backgroundColor = "transparent";
		this.lineButton.style.backgroundColor = "#e6e6e6";
		this.smaButton.style.backgroundColor = "transparent";
		this.emaButton.style.backgroundColor = "transparent";
		this.chart.unsubscribeClick(this.boundHandleChartClick);
		this.chart.unsubscribeCrosshairMove(this.boundHandleCrosshairMove);
		this.domElement.removeEventListener("mousedown", this.boundHandleMouseDown);
		this.domElement.removeEventListener("mouseup", this.boundHandleMouseUp);
		this.chart.subscribeClick(this.boundDrawVerticalLine);
		console.log("Vertical Line mode activated.");
	});
	this.smaButton.addEventListener("click", () => {
		this.diagonalButton.style.backgroundColor = "transparent";
		this.crossHairButton.style.backgroundColor = "transparent";
		this.lineButton.style.backgroundColor = "transparent";
		this.smaButton.style.backgroundColor = "#e6e6e6";
		this.emaButton.style.backgroundColor = "transparent";
		this.chart.unsubscribeClick(this.boundHandleChartClick);
		this.chart.unsubscribeCrosshairMove(this.boundHandleCrosshairMove);
		this.domElement.removeEventListener("mousedown", this.boundHandleMouseDown);
		this.domElement.removeEventListener("mouseup", this.boundHandleMouseUp);
		this.chart.unsubscribeClick(this.boundDrawVerticalLine);
		console.log("sma mode activated.");
		this.sma();
	});
	this.emaButton.addEventListener("click", () => {
		this.diagonalButton.style.backgroundColor = "transparent";
		this.crossHairButton.style.backgroundColor = "transparent";
		this.lineButton.style.backgroundColor = "transparent";
		this.smaButton.style.backgroundColor = "transparent";
		this.emaButton.style.backgroundColor = "#e6e6e6";
		this.chart.unsubscribeClick(this.boundHandleChartClick);
		this.chart.unsubscribeCrosshairMove(this.boundHandleCrosshairMove);
		this.domElement.removeEventListener("mousedown", this.boundHandleMouseDown);
		this.domElement.removeEventListener("mouseup", this.boundHandleMouseUp);
		this.chart.unsubscribeClick(this.boundDrawVerticalLine);
		console.log("ema mode activated.");
		this.ema();
	});
	
  }

  filterData(data) {
	  data.forEach((d) => {
        // Check if SMA value exists, and if so, add the time and value to sma_data array
			this.klines.push({
			time: Math.floor(new Date(d.Date).getTime() / 1000),
			open: d.Open,
			high: d.High,
			low: d.Low,
			close: d.Close,
			});
			if (d.SMA) {
				this.smaData.push({ time: Math.floor(new Date(d.Date).getTime() / 1000), value: d.SMA });
			}

        // Check if EMA value exists, and if so, add the time and value to ema_data array
			if (d.EMA) {
				this.emaData.push({ time: Math.floor(new Date(d.Date).getTime() / 1000), value: d.EMA });
			}

        // Check if RSI value exists, and if so, add the time and value to rsi_data array
			if (d.RSI) {
				this.rsiData.push({ time: Math.floor(new Date(d.Date).getTime() / 1000), value: d.RSI });
			}
		});
	}


  async loadData(timeFrame = null) {
    try {
      const urlPath = window.location.pathname;
      const parts = urlPath.split('/');
	  const timeFrameToLoad = timeFrame ? timeFrame: parts[4];

      const response = await fetch(`/get_backtest_data/${parts[2]}/${parts[3]}/${timeFrameToLoad}/${parts[5]}/${parts[6]}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const parsedData = JSON.parse(data.data);

      if (!Array.isArray(parsedData)) {
        throw new TypeError("Data format error: Expected data to be an array.");
      }

      this.filterData(parsedData);
	  console.log(this.klines);
	  console.log(this.rsiData);
	  console.log(this.emaData);
	  console.log(this.smaData);
	  this.getPriceRange();
      this.xspan = parsedData
        .map((item) => Math.floor(new Date(item.Date).getTime() / 1000))
        .map((d, i, arr) => (i ? arr[i] - arr[i - 1] : 0))[2];

      const prebars = Array.from({ length: 100 }, (_, i) => ({
        time: this.klines[0].time - (i + 1) * this.xspan,
      }));

      const postbars = Array.from({ length: 100 }, (_, i) => ({
        time: this.klines[this.klines.length - 1].time + (i + 1) * this.xspan,
      }));

      this.candleseries.setData([...prebars, ...this.klines, ...postbars]);
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    }
  }

  handleChartClick(param) {
    console.log("handleChartClick triggered");
    if (this.isUpdatingLine) return;
    if (this.isDragging) return;
    const xTs = param.time
      ? param.time
      : this.klines[0]["time"] + param.logical * this.xspan;
    const yPrice = this.candleseries.coordinateToPrice(param.point.y);
    this.hoveredLine
      ? this.startDrag(xTs, yPrice)
      : this.handleLineDrawing(xTs, yPrice);
  }

  handleCrosshairMove(param) {
    if (this.isUpdatingLine) return;
    const xTs = param.time
      ? param.time
      : this.klines[0]["time"] + param.logical * this.xspan;
    const yPrice = this.candleseries.coordinateToPrice(param.point.y);
    this.lastCrosshairPosition = { x: xTs, y: yPrice };

    this.startPoint
      ? this.updateLine(xTs, yPrice)
      : this.handleHoverEffect(xTs, yPrice);

    if (this.isDragging) {
      const deltaX = xTs - this.dragStartPoint.x;
      const deltaY = yPrice - this.dragStartPoint.y;
      let newLineData;
      newLineData = this.dragStartLineData.map((point, i) =>
        this.selectedPoint !== null
          ? i === this.selectedPoint
            ? {
                time: point.time + deltaX,
                value: point.value + deltaY,
              }
            : point
          : {
              time: point.time + deltaX,
              value: point.value + deltaY,
            }
      );

      this.dragLine(newLineData);
    }
  }

  handleMouseDown(e) {
    if (!this.lastCrosshairPosition) return;
    if (this.hoveredLine) {
      this.startDrag(
        this.lastCrosshairPosition.x,
        this.lastCrosshairPosition.y
      );
    }
  }

  handleMouseUp() {
    this.endDrag();
  }

  handleLineDrawing(xTs, yPrice) {
    if (!this.startPoint) {
      this.startPoint = { time: xTs, price: yPrice };
    } else {
	  const newLineSeries = this.chart.addLineSeries();
      newLineSeries.setData([
        { time: this.startPoint.time, value: this.startPoint.price },
        { time: xTs, value: yPrice },
      ]);
	  const lineObject = {
            lineSeries: newLineSeries,
            isHovered: false
      };
	  this.lineSeriesArray.push(lineObject);
      this.startPoint = null;
      this.selectedPoint = null;
    }
  }

  handleHoverEffect(xTs, yPrice) {
	if (this.lineSeriesArray.length !== 0) {
		for (const lineObject of this.lineSeriesArray) {
			const linedata = lineObject.lineSeries.data();
			const hoverStatus = this.isLineHovered(
			xTs,
			yPrice,
			linedata[0],
			linedata[1]
			);
			if (hoverStatus && !lineObject.isHovered) {
				this.startHover(lineObject);
			}
			if (!hoverStatus && lineObject.isHovered && !this.isDragging) {
				this.endHover(lineObject);
			}
		}
	}
  }

  startHover(lineObject) {
    lineObject.isHovered = true;
	this.hoveredLine = lineObject;
    lineObject.lineSeries.applyOptions({ color: "orange" });
    this.domElement.style.cursor = "pointer";
    this.chart.applyOptions({ handleScroll: false, handleScale: false });
  }

  endHover(lineObject) {
    lineObject.isHovered = false;
	this.hoveredLine = null;
    lineObject.lineSeries.applyOptions({ color: "dodgerblue" });
    this.domElement.style.cursor = "default";
    this.chart.applyOptions({ handleScroll: true, handleScale: true });
  }

  startDrag(xTs, yPrice) {
    console.log("startDrag triggered");
    this.isDragging = true;
    this.dragStartPoint = { x: xTs, y: yPrice };
    this.dragStartLineData = [...this.hoveredLine.lineSeries.data()];
  }

  endDrag() {
    console.log("endDrag triggered");
    this.isDragging = false;
    this.dragStartPoint = null;
    this.dragStartLineData = null;
    this.selectedPoint = null;
  }

  updateLine(xTs, yPrice) {
    this.isUpdatingLine = true;
    this.updateLineSeries.setData([
      { time: this.startPoint.time, value: this.startPoint.price },
      { time: xTs, value: yPrice },
    ]);
    this.selectedPoint = null;
    this.isUpdatingLine = false;
  }
  dragLine(newCords) {
	console.log("hoveredLine");
	console.log(this.hoveredLine.lineSeries.data());
    this.isUpdatingLine = true;
    this.hoveredLine.lineSeries.setData(newCords);
    this.isUpdatingLine = false;
	console.log("hoveredLine 2");
	console.log(this.hoveredLine.lineSeries.data());
	for (const lineObject of this.lineSeriesArray) {
		console.log("arrayobject");
		console.log(lineObject.lineSeries.data());
	}
  }

  isLineHovered(xTs, yPrice, point1, point2) {
    // CHECK IF POINT IS SELECTED
    if (this.isDragging) return true;
    const isPoint1 =
      xTs === point1.time &&
      (Math.abs(yPrice - point1.value) * 100) / yPrice < this.hoverThreshold;
    if (isPoint1) {
      this.selectedPoint = 0;
      return true;
    }
    const isPoint2 =
      xTs === point2.time &&
      (Math.abs(yPrice - point2.value) * 100) / yPrice < this.hoverThreshold;
    if (isPoint2) {
      this.selectedPoint = 1;
      return true;
    }

    this.selectedPoint = null;
    const m = (point2.value - point1.value) / (point2.time - point1.time);
    const c = point1.value - m * point1.time;
    const estimatedY = m * xTs + c;
    return (Math.abs(yPrice - estimatedY) * 100) / yPrice < this.hoverThreshold;
  }
  getPriceRange() {
	  this.klines.forEach(candle => {
		  if (candle.high > this.highestValue) {
			this.highestValue = candle.high;
			}
		if (candle.low < this.lowestValue) {
			this.lowestValue = candle.low;
			}
	  });
  }

  drawVerticalLine(param) {
	console.log("drawVerticalLine triggered");
    const xTs = param.time
      ? param.time
      : this.klines[0]["time"] + param.logical * this.xspan;
    const verticalLineSeries = this.chart.addLineSeries({
		color: 'black',  // You can change this to any color
		lineWidth: 2,  // Width of the line
	});
	verticalLineSeries.setData([
		{ time: xTs, value: this.highestValue },  // Starting point (bottom of the chart)
		{ time: xTs, value: this.lowestValue }, // Ending point (top of the chart)
	]);
  }  

  sma() {
	  const sma_series = this.chart.addLineSeries({ color: 'red', lineWidth: 1 });
	  sma_series.setData(this.smaData);
  }
  ema() {
	  const ema_series = this.chart.addLineSeries({ color: 'blue', lineWidth: 1 });
	  ema_series.setData(this.emaData);
  }


}

const manager = new ChartManager();
