# Generated by Django 5.2 on 2025-05-05 10:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lighthouse_api', '0002_dummylighthouse_delete_lighthouse'),
    ]

    operations = [
        migrations.CreateModel(
            name='Lighthouse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('country', models.CharField(max_length=100)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('height', models.FloatField(blank=True, null=True)),
                ('year_built', models.IntegerField(blank=True, null=True)),
                ('image_url', models.URLField(blank=True, null=True)),
            ],
        ),
        migrations.DeleteModel(
            name='DummyLighthouse',
        ),
    ]
