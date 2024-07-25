# Generated by Django 5.0.7 on 2024-07-25 10:33

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Building',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='ОСНОВНОЙ КУРС', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ComplaintTypes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
            ],
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='1 КУРС', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='ОИТ', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Hobby',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='УЧЕБА В ЯГК', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('image', models.ImageField(blank=True, null=True, upload_to='imagesUser/')),
                ('sur_name', models.CharField(blank=True, default=None, max_length=50, null=True)),
                ('description', models.TextField(blank=True, default='Ищу друзей', null=True)),
                ('is_search_friend', models.BooleanField(default=False)),
                ('is_search_love', models.BooleanField(default=False)),
                ('vk_contact', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('tg_contact', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('is_boy', models.BooleanField(default=True)),
                ('building', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='SwipeApp.building')),
                ('course', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='SwipeApp.course')),
                ('department', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='SwipeApp.department')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('hobbies', models.ManyToManyField(blank=True, to='SwipeApp.hobby')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='SwipeMatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_swiper', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='first_swiper', to=settings.AUTH_USER_MODEL)),
                ('second_swiper', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='second_swiper', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Swipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('swiped', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='swiped', to=settings.AUTH_USER_MODEL)),
                ('swiper', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='swiper', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ComplaintList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('complaint_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SwipeApp.complainttypes')),
                ('author_complaint', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='author_complaint', to=settings.AUTH_USER_MODEL)),
                ('imposter_complaint', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='imposter_complaint', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
