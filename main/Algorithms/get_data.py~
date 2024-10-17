import yfinance as yf
from django.http import JsonResponse

def get_data(request, ticker):
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1mo", interval="1h")  # or specify another period, like "1mo", "1y", etc.
        data.rename_axis("Date", inplace=True)
        data_json = data.reset_index().to_json(orient="records")
        return JsonResponse({'status': 'success', 'data': data_json}, safe=False)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

