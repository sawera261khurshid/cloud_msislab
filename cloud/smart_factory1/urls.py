from django.urls import path
from . import views
from .views import save_vitenam_data
from .views import get_camera_data
from .views import get_anomalies_data
from . import views
# from .views import save_vitenam_data

#  URLConf
urlpatterns = [
    # path("", views.sub_mqtt, name='homepage'),
    # path("", views.homePage, name='homepage'),
    # path("Incheon/", views.IncheonPage, name='incheon-site'),
    # path("Incheon/mqtt.html", views.sub_mqtt, name='incheon'),
    path("", views.Main_Page, name='test-site'),  #### Render main page
    path("Incheon/", views.sub_mqtt, name='incheon-site'), ### Render Incheon Page
    path("Gwangju/", views.testing, name='gwangju-site'), ### Render Gwanju Page
    path("Pyeongteak/", views.sub_mqtt, name='pyeongteak-site'),  ####v Render Pyeongteak Page
    path('Vitenam/', views.vitenam, name='vitenam'),
    path('save-vitenam-data/', save_vitenam_data, name='save_vitenam_data'),
    # path('get_camera_data/', get_camera_data, name='get_camera_data'),
    path('get_camera_data/<str:camera_name>/', get_camera_data, name='get_camera_data'),
    path('get_anomalies_data/<str:camera_name>/', get_anomalies_data, name='get_anomalies_data'),
    path('', views.home_view, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('incheon/', views.incheon_view, name='incheon'),  # Add URL pattern for the Incheon page


    # path('save-vitenam-data/', save_vitenam_data, name='save_vitenam_data'),

    # path('api/get-camera-data/<str:camera_name>/', get_camera_data, name='get_camera_data'),
]
