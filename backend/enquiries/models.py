from django.db import models

class Enquiry(models.Model):
    name = models.CharField(max_length=100)
    company = models.CharField(max_length=120)
    email = models.EmailField(max_length=254)
    phone = models.CharField(max_length=30)
    service = models.CharField(max_length=100)
    goals = models.TextField(max_length=3000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.company} - {self.service}"

