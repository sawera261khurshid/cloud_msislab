# from django.shortcuts import render

# Create your views here.
#############################################################################
############################## smart factory ################################
#############################################################################

from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from .models import vitenamData
# from .models import VitenamData

import logging

logger = logging.getLogger(__name__)

# Create your views here.

def sub_mqtt(request):
    return render(request, 'mqtt.html', {})

def homePage(request):
    return render (request, 'Home.html')

def IncheonPage(request):
    return render (request, 'Incheon.html')

def Main_Page(request):
    return render (request, 'Main.html')

def IncheonPage(request):
    return render (request, 'Incheon.html')
def IncheonPage(request):
    return render (request, 'Incheon.html')

def testing(request):
    return render (request, 'exp.html')

def vitenam(request):
    return render (request, 'vitenam.html')

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
# from django.db.models import Sum, F
from django.db.models import Sum, Case, When, Value, IntegerField
from django.utils import timezone
import pytz
from .models import PinArrivalStatus

threshold = 10

@csrf_exempt
@require_POST
def save_vitenam_data(request):
    try:
        total_detections = 0
        total_anomalies = 0
        
        data = json.loads(request.body)
        camera = data.get('camera')
        status = data.get('status')
        # Extracting trigger values
        trigger_values = data.get("trigger_matching_similarity", {})
        trigger_0 = trigger_values.get("0")
        trigger_1 = trigger_values.get("1")
        
        # Extracting detections
        det_data = data.get("det", {})
        detections_0 = det_data.get("dets", {}).get("0", {}) if isinstance(det_data, dict) else {}
        detections_1 = det_data.get("dets", {}).get("1", {}) if isinstance(det_data, dict) else {}

        # Calculate the total number of detections
        total_detections = sum(detections_0.values()) + sum(detections_1.values())

        # Check for anomalies and update total anomalies
        if status == PinArrivalStatus.ARRIVED:
            total_detections += 1
        else:
            total_anomalies += 1
            
        proc_time = data.get("proc_time")
        print("Proc time:", proc_time) 

        # Save data to the database
        analysis_data = vitenamData.objects.create(
            camera=camera,
            status=status,
            trigger_similarity_0=trigger_0,
            trigger_similarity_1=trigger_1,
            det_0=json.dumps(detections_0) if detections_0 else None,
            det_1=json.dumps(detections_1) if detections_1 else None,
            proc_time=proc_time,
            # timestamp=datetime.utcfromtimestamp(data.get("ts")),       
        )

        # Debugging
        print(f'AnalysisData saved: {analysis_data}')

        return JsonResponse({'status': 'success', 'message': 'Data saved successfully', 'total_detections': total_detections, 'total_anomalies': total_anomalies})
    except Exception as e:
        print(f'Error saving data: {str(e)}')
        return JsonResponse({'status': 'error', 'message': f'Error: {str(e)}'})
    
from datetime import datetime

# def get_camera_data(request, camera_name):
#     try:
#         camera_name = 'mold-0001'
#         # Fetch latest camera data from the AnalysisData model based on the provided camera_name
#         # shows 20 entries
#         # camera_instance = vitenamData.objects.filter(camera=camera_name).order_by('-timestamp')[:20]   
#         # shows latest entries
#         # camera_instance = vitenamData.objects.filter(camera=camera_name).latest('timestamp')
#         # shows results for full data / entries
#         camera_instance = vitenamData.objects.filter(camera=camera_name)


#         # Format timestamp
#         # formatted_timestamp = datetime.utcfromtimestamp(camera_instance.timestamp.timestamp()).strftime('%Y-%m-%d %H:%M:%S')
#         # camera_instance = camera_instance.latest('timestamp').timestamp


#         # Initialize counters for detections and anomalies
#         detection_count = 0
#         anomaly_count = 0

#         # Check the status and update counts accordingly
#         status = camera_instance.status
#         if status:
#             # Split the status string into a list of integers
#             stt_values = [int(val) for val in status.split(', ')]

#             # Check the first value of the stt list
#             if stt_values[0] == 6:  # Assuming 6 indicates a detection, update detection count
#                 detection_count += 1
#             else:  # Otherwise, update anomaly count
#                 anomaly_count += 1

#         # Return the camera data (total detections, total anomalies, and timestamp) as a JSON response
#         camera_data = {
#             'total_detections': detection_count,
#             'total_anomalies': anomaly_count,
#             # 'timestamp': formatted_timestamp
#         }

#         # Return camera data as JSON response
#         return JsonResponse(camera_data)
    
#     except vitenamData.DoesNotExist as e:
#         # Log the error
#         logger.error(f"An error occurred while fetching data for camera '{camera_name}': {e}")
        
#         # Handle the case where the specified camera_name is not found
#         return JsonResponse({'error': 'Camera not found'}, status=404)
#     except Exception as e:
#         # Log the error
#         logger.error(f"An unexpected error occurred: {e}")
        
#         # Return an error response
#         return JsonResponse({'error': 'Internal Server Error'}, status=500)

from django.db.models import Count
from django.utils import timezone

def get_camera_data(request, camera_name):
    try:
        # Fetch all camera data for the specified camera_name
        camera_data = vitenamData.objects.filter(camera=camera_name)

        # Initialize counters for detections and anomalies
        total_detections = 0
        total_anomalies = 0
        # Initialize a list to store timestamps
        timestamps = []

        # Iterate over each data entry to count detections and anomalies
        for entry in camera_data:
            if entry.status:
                # Split the status string into a list of integers
                stt_values = [int(val) for val in entry.status.split(', ')]

                # Count the number of detections and anomalies
                total_detections += stt_values.count(6)  # Assuming 6 indicates a detection
                total_anomalies += stt_values.count(12)

                 # Append the timestamp to the timestamps list
                timestamps.append(entry.timestamp.strftime('%Y-%m-%d %H:%M:%S'))

                # Get the current time
        # current_time = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        current_time = timezone.localtime(timezone.now()).strftime('%Y-%m-%d %H:%M:%S')

        

        # Prepare the response data
        camera_data = {
            'total_detections': total_detections,
            'total_anomalies': total_anomalies,
             'data_count': camera_data.count(),
            'timestamps': timestamps,
            'current_time': current_time
           
        }

        return JsonResponse(camera_data)
    
    except vitenamData.DoesNotExist:
        logger.error(f"No data found for camera '{camera_name}'")
        return JsonResponse({'error': 'Camera not found'}, status=404)
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        return JsonResponse({'error': 'Internal Server Error'}, status=500)


# def get_camera_data(request, camera_name):
#     try:
#         # Fetch latest camera data from the AnalysisData model based on the provided camera_name
#         camera_instance = vitenamData.objects.filter(camera=camera_name).latest('timestamp')

#         # Format timestamp
#         formatted_timestamp = datetime.utcfromtimestamp(camera_instance.timestamp.timestamp()).strftime('%Y-%m-%d %H:%M:%S')

#         # Initialize counters for detections and anomalies
#         detection_count = 0
#         anomaly_count = 0

#         # Check the status and update counts accordingly
#         status = camera_instance.status
#         if status == PinArrivalStatus.ARRIVED:
#             detection_count += 1
#         else:
#             anomaly_count += 1

#         # Return the camera data (total detections, total anomalies, and timestamp) as a JSON response
#         camera_data = {
#             'total_detections': detection_count,
#             'total_anomalies': anomaly_count,
#             'timestamp': formatted_timestamp
#         }

#         return JsonResponse(camera_data)

#     except vitenamData.DoesNotExist:
#         # Handle the case where the specified camera_name is not found
#         return JsonResponse({'error': 'Camera not found'}, status=404)    
    
# def get_camera_data(request, camera_name):
#     try:
#         camera_name = 'mold-0001'

#         # Fetch camera data from the AnalysisData model based on the provided camera_name
#         camera_instance = vitenamData.objects.filter(camera=camera_name).latest('timestamp')

#         # Format timestamp
#         formatted_timestamp = datetime.utcfromtimestamp(camera_instance.timestamp.timestamp()).strftime('%Y-%m-%d %H:%M:%S')

#         # Format trigger values
#         formatted_trigger = {
#             '0': round(camera_instance.trigger_similarity_0, 2),
#             '1': round(camera_instance.trigger_similarity_1, 2)
#         }

#         det_0 = json.loads(camera_instance.det_0) if camera_instance.det_0 else {}
#         det_1 = json.loads(camera_instance.det_1) if camera_instance.det_1 else {}
        
#         # Initialize counters for detections and anomalies
#         detection_count = 0
#         anomaly_count = 0

#         # Check the status and update counts accordingly
#         status = camera_instance.status
#         if status == PinArrivalStatus.ARRIVED:
#             detection_count += 1
#         else:
#             anomaly_count += 1

#         # Construct a dictionary with the retrieved data
#         camera_data = {
#             'stt': [int(val) for val in status.split(', ')],
#             'ts': formatted_timestamp,
#             'trigger_matching_similarity': formatted_trigger,
#             'det_0': det_0,
#             'det_1': det_1,
#             'total_anomalies': anomaly_count,
#             'total_detections': detection_count
#         }

#         # Return the camera data as a JSON response
#         return JsonResponse(camera_data)

#     except vitenamData.DoesNotExist:
#         # Handle the case where the specified camera_name is not found
#         return JsonResponse({'error': 'Camera not found'}, status=404)

# def get_camera_data(request, camera_name):
#     try:
#         camera_name = 'mold-0001'

#         # Fetch camera data from the AnalysisData model based on the provided camera_name
#         camera_instance = vitenamData.objects.filter(camera=camera_name).latest('timestamp')

#         # Format timestamp
#         formatted_timestamp = datetime.utcfromtimestamp(camera_instance.timestamp.timestamp()).strftime('%Y-%m-%d %H:%M:%S')

#         # Initialize counters for detections and anomalies
#         detection_count = 0
#         anomaly_count = 0

#         # Check the status and update counts accordingly
#         status = camera_instance.status
#         if status == PinArrivalStatus.ARRIVED:
#             detection_count += 1
#         else:
#             anomaly_count += 1

#         # Format the status as 'Normal' or 'NG'
#         formatted_status = 'Normal' if status == 6 else 'NG'

#         # Construct a dictionary with the retrieved data
#         camera_data = {
#             'status': formatted_status,
#             'timestamp': formatted_timestamp,
#             'total_anomalies': anomaly_count,
#             'total_detections': detection_count
#         }

#         # Return the camera data as a JSON response
#         return JsonResponse(camera_data)

#     except vitenamData.DoesNotExist:
#         # Handle the case where the specified camera_name is not found
#         return JsonResponse({'error': 'Camera not found'}, status=404)
    
def convert_to_local_time(utc_timestamp):
    # Convert UTC timestamp to datetime object
    utc_datetime = timezone.datetime.utcfromtimestamp(utc_timestamp)

    # Set the UTC timezone
    utc_timezone = pytz.timezone('UTC')

    # Local timezone for South Korea
    local_timezone = pytz.timezone('Asia/Seoul')

    # Convert UTC datetime to local datetime
    local_datetime = utc_timezone.localize(utc_datetime).astimezone(local_timezone)

    return local_datetime.strftime('%Y-%m-%d %H:%M:%S')

def get_anomalies_data(request, camera_name):
    try:
        # Fetch anomalies data for the specified camera_name where status value at index 0 is 12
        anomalies_data = vitenamData.objects.filter(camera=camera_name, status__startswith='12')
        
        # Initialize a list to store the anomalies data
        anomalies = []
        logging.debug(f"Anomalies data for {camera_name}: {anomalies_data}")

        # Iterate over each anomaly data entry and extract relevant information
        for entry in anomalies_data:
            anomaly = {
                'camera': entry.camera,
                'status': entry.status,
                'trigger_matching_similarity': {
                    'cast_similarity': entry.trigger_similarity_0,
                    'connector_similarity': entry.trigger_similarity_1
                },
                'proc_time': entry.proc_time,
                'timestamp': entry.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }
            anomalies.append(anomaly)

        return JsonResponse({'anomalies': anomalies})
    except vitenamData.DoesNotExist:
        logger.error(f"No anomalies data found for camera '{camera_name}'")
        return JsonResponse({'error': 'Anomalies data not found'}, status=404)
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        return JsonResponse({'error': 'Internal Server Error'}, status=500)

#############################################################################
############################## Login Page ###################################
#############################################################################
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages

def home_view(request):
    return render(request, 'main.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

def incheon_view(request):
    # Add your view logic here
    return render(request, 'incheon.html') 