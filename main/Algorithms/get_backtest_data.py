import yfinance as yf
from django.http import JsonResponse
import ta
import pandas as pd

# Function to add SMA indicator
def add_sma(data, period=100):
    # Using ta.trend.SMAIndicator
    data['SMA'] = ta.trend.SMAIndicator(close=data['Close'], window=period).sma_indicator()
    return data

# Function to add EMA indicator
def add_ema(data, period=21):
    # Using ta.trend.EMAIndicator
    data['EMA'] = ta.trend.EMAIndicator(close=data['Close'], window=period).ema_indicator()
    return data

# Function to add RSI indicator
def add_rsi(data, period=14):
    # Using ta.momentum.RSIIndicator
    data['RSI'] = ta.momentum.RSIIndicator(close=data['Close'], window=period).rsi()
    return data

def get_backtest_data(request, ticker, type, interval, start, end):
    try:
        # Modify the ticker if it's Forex
        if type == "Forex":
            ticker = ticker + "=X"
        
        # Fetch data using yfinance
        stock = yf.Ticker(ticker)
        data = stock.history(interval=interval, start=start, end=end)
        data.rename_axis("Date", inplace=True)

        # Apply technical indicators using ta library
        data = add_sma(data, period=100)
        data = add_ema(data, period=21)
        data = add_rsi(data, period=14)

        # Convert the data to JSON format
        data_json = data.reset_index().to_json(orient="records")
        
        # Return the data as a JSON response
        return JsonResponse({'status': 'success', 'data': data_json}, safe=False)
    except Exception as e:
        # Handle errors
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

