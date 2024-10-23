from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse

def welcome(request):
    return render(request, 'main/welcome.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("home")  # Redirect to a home page after login
        else:
            return render(request, 'main/login.html', {'error': 'Invalid credentials'})
    return render(request, 'main/login.html')

def home(request):
    return render(request, 'main/home.html')

def signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        User.objects.create_user(username=username, email=email, password=password)
        return redirect('login')  # Redirect to login page after signup
    return render(request, 'main/signup.html')

def guest(request):
    # Implement guest access logic here
    return render(request, 'main/guest.html')

# myapp/views.py
from rest_framework import viewsets
from .models import CurrencyPair
from .serializers import CurrencyPairSerializer

class CurrencyPairViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CurrencyPair.objects.all()
    serializer_class = CurrencyPairSerializer

def chart(request, ticker):
    return render(request, 'main/chart.html')

def backtest_chart(request, ticker, type, interval, start, end):
    return render(request, 'main/backtest_chart.html')
    
def info(request):
    return render(request, 'main/info.html')


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserPreferences
from django.contrib.auth.decorators import login_required
import json

@csrf_exempt
@login_required
def add_to_favorites(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            symbol = data.get('symbol')
            type = data.get('type')

            # Retrieve user preferences based on Django's built-in User model
            user_preferences, created = UserPreferences.objects.get_or_create(user=request.user)

            # Check if 'fav_pairs' already contains the asset
            fav_pairs = user_preferences.fav_pairs if user_preferences.fav_pairs else []

            # Check if the asset is already in favorites
            asset_exists = any(pair['name'] == name and pair['symbol'] == symbol and pair['type'] == type for pair in fav_pairs)

            if asset_exists:
                # Remove the asset from favorites
                fav_pairs = [pair for pair in fav_pairs if not (pair['name'] == name and pair['symbol'] == symbol and pair['type'] == type)]
                message = 'Removed from favorites'
            else:
                # Add new favorite pair
                fav_pairs.append({'name': name, 'symbol': symbol, 'type': type})

            # Update the user's preferences with the new favorites
            user_preferences.fav_pairs = fav_pairs
            user_preferences.save()

            

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)



from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import UserPreferences

@login_required
def get_favorites(request):
    try:
        # Retrieve the logged-in user's preferences
        user_preferences = UserPreferences.objects.get(user=request.user)
        
        # Send back the user's favorite pairs
        return JsonResponse({'fav_pairs': user_preferences.fav_pairs}, status=200)
    
    except UserPreferences.DoesNotExist:
        # If the user has no preferences yet, return an empty list
        return JsonResponse({'fav_pairs': []}, status=200)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
