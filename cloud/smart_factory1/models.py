from django.db import models
from django.utils import timezone

class vitenamData(models.Model):
    camera = models.CharField(max_length=20)
    status = models.CharField(max_length=255)
    trigger_similarity_0 = models.FloatField(null=True, blank=True)
    trigger_similarity_1 = models.FloatField(null=True, blank=True)
    # trigger_matching_similarity = models.JSONField(null=True, blank=True)
    det_0 = models.JSONField(null=True, blank=True)  
    det_1 = models.JSONField(null=True, blank=True)  
    proc_time = models.FloatField(null=True, blank=True)  
    timestamp = models.DateTimeField(auto_now_add=True)

    # Add a date field for organizing data on a daily basis
    # date = models.DateField()
    # date = models.DateTimeField(auto_now_add=True)

    # def save(self, *args, **kwargs):
    #     print("Saving AnalysisData instance...")
    #     self.date = self.timestamp.date() if self.timestamp else None
    #     print(f"Date set to: {self.date}")
    #     super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.camera} - {self.timestamp}"
    
class PinArrivalStatus:
    NOT_READY = 0
    READY_TO_VERIFY = 1
    FAIL_LOW_CONFIDENCE_PIN = 2
    FAIL_NON_SYNCHRONIZED_PIN_ARRIVAL = 3
    AE_VERIFIES = 4
    AE_FAILED = 5
    ARRIVED = 6    