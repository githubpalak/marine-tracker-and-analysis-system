# Generated by Django 5.2 on 2025-04-23 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Port',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('country', models.CharField(max_length=100)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('size', models.CharField(blank=True, max_length=50, null=True)),
                ('un_locode', models.CharField(blank=True, max_length=20, null=True)),
                ('image_url', models.URLField(blank=True, null=True)),
            ],
        ),
    ]
