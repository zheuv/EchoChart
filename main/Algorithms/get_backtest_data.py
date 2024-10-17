import yfinance as yf
from django.http import JsonResponse

def get_backtest_data(request, ticker, type, interval, start, end):
    try:
        if type == "Forex":
            ticker = ticker + "=X"
        stock = yf.Ticker(ticker)
        data = stock.history(interval=interval, start=start, end=end)  # or specify another period, like "1mo", "1y", etc.
        data.rename_axis("Date", inplace=True)
        data_json = data.reset_index().to_json(orient="records")
        return JsonResponse({'status': 'success', 'data': data_json}, safe=False)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
