# Generated by Django 3.1.1 on 2020-09-11 18:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_followers_following_post'),
    ]

    operations = [
        migrations.AlterField(
            model_name='followers',
            name='followerscount',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='following',
            name='followingcount',
            field=models.IntegerField(default=0),
        ),
    ]
