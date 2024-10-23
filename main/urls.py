from django.urls import path
from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CurrencyPairViewSet
from .Algorithms.get_data import get_data
from .Algorithms.get_backtest_data import get_backtest_data
router = DefaultRouter()
router.register(r'currency-pairs', CurrencyPairViewSet)

urlpatterns = [
    path('welcome/', views.welcome, name='welcome'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup, name='signup'),
    path('guest/', views.guest, name='guest'),
    path('home/', views.home, name='home'),
    path('info/', views.info, name='info'),
    path('chart/<str:ticker>/', views.chart, name='chart'),
    path('backtest_chart/<str:ticker>/<str:type>/<str:interval>/<str:start>/<str:end>/', views.backtest_chart, name='backtest_chart'),
    path('', include(router.urls)),
    path('get_data/<str:ticker>/', get_data, name='get_data'),
    path('get_backtest_data/<str:ticker>/<str:type>/<str:interval>/<str:start>/<str:end>/', get_backtest_data, name='get_backtest_data'),
    path('add-to-favorites/', views.add_to_favorites, name='add_to_favorites'),
    path('get-favorites/', views.get_favorites, name='get_favorites'),
]

