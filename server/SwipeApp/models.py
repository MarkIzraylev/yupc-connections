import uuid

from django.contrib.auth.models import AbstractUser, AbstractBaseUser
from django.db import models
import datetime


class ComplaintTypes(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:  
        verbose_name = 'Тип жалобы'  
        verbose_name_plural = 'Типы жалоб' 


class Hobby(models.Model):
    name = models.CharField(max_length=50, default="УЧЕБА В ЯГК")

    def __str__(self):
        return self.name

    class Meta:  
        verbose_name = 'Хобби'  
        verbose_name_plural = 'Хобби' 


class Course(models.Model):
    name = models.CharField(max_length=50, default="1 КУРС")

    def __str__(self):
        return self.name

    class Meta:  
        verbose_name = 'Курс'  
        verbose_name_plural = 'Курсы' 


class Building(models.Model):
    name = models.CharField(max_length=50, default="ОСНОВНОЙ КУРС")

    def __str__(self):
        return self.name

    class Meta:  
        verbose_name = 'Корпус'  
        verbose_name_plural = 'Корпусы' 


class Department(models.Model):
    name = models.CharField(max_length=50, default="ОИТ")

    def __str__(self):
        return self.name
    
    class Meta:  
        verbose_name = 'Отделение'  
        verbose_name_plural = 'Отделения' 


class User(AbstractUser):
    email = models.EmailField(max_length=100 , unique=True)
    image = models.ImageField(upload_to='imagesUser/', null=True, blank=True)
    description = models.TextField(default='Ищу друзей', null=True,blank=True, max_length=170)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, default=None, null=True,blank=True)
    building = models.ForeignKey(Building, on_delete=models.CASCADE,default=None, null=True,blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE,default=None, null=True,blank=True)
    is_search_friend = models.BooleanField(default=True, null=True, blank=True)
    is_search_love = models.BooleanField(default=False,  null=True, blank=True)
    vk_contact = models.CharField(max_length=100, default=None, null=True, blank=True)
    tg_contact = models.CharField(max_length=100, default=None, null=True,blank=True)
    hobbies = models.ManyToManyField(Hobby,blank=True)
    is_boy = models.BooleanField(default=True)
    is_blocked = models.BooleanField(default=False, verbose_name="Заблокирован")
    block_reason = models.TextField(blank=True, null=True, verbose_name="Причина блокировки")

    class Meta:
        verbose_name = 'Студент'
        verbose_name_plural = 'Студенты'


class ComplaintList(models.Model):
    complaint_type = models.ForeignKey(ComplaintTypes, on_delete=models.CASCADE)
    author_complaint = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author_complaint')
    imposter_complaint = models.ForeignKey(User, on_delete=models.CASCADE, related_name='imposter_complaint')
    created_at = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return f" Жалоба {self.author_complaint} на {self.imposter_complaint}  Причина - {self.complaint_type.name} "
    
    class Meta:
        verbose_name = 'Жалоба'
        verbose_name_plural = 'Список жалоб'


class Swipe(models.Model):
    swiper = models.ForeignKey(User, on_delete=models.CASCADE, related_name='swiper')
    swiped = models.ForeignKey(User, on_delete=models.CASCADE, related_name='swiped')
    swiper_is_like = models.BooleanField(default=None, null=True,blank=True) # первый лайкнул или нет
    swiped_is_like = models.BooleanField(default=None, null=True, blank=True) # второй лайкнул или нет

    def __str__(self):
        return f"{self.swiper.last_name} свайпнул {self.swiped.last_name}"

    class Meta:
        verbose_name = 'Свайп'
        verbose_name_plural = 'Свайпы'


class InvitationsUser(models.Model):
    code = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    quantity_activation = models.IntegerField(default=1)

    def __str__(self):
        return f"Осталось {self.quantity_activation} активаций приглашения"
    
    class Meta:
        verbose_name = 'Приглашение'
        verbose_name_plural = 'Приглашения'
