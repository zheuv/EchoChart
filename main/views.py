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
