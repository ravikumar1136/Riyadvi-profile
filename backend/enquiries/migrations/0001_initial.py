from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [migrations.CreateModel(
        name="Enquiry",
        fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
            ("name", models.CharField(max_length=100)),
            ("company", models.CharField(max_length=120)),
            ("email", models.EmailField(max_length=254)),
            ("phone", models.CharField(max_length=30)),
            ("service", models.CharField(max_length=100)),
            ("goals", models.TextField(max_length=3000)),
            ("created_at", models.DateTimeField(auto_now_add=True)),
        ],
        options={"ordering": ["-created_at"]},
    )]
