from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Model


# Create your models here.

# Таблица с типами жалоб
class ComplaintTypes(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name
# Хобби
class Hobby(models.Model):
    name = models.CharField(max_length=100, default="УЧЕБА В ЯГК")

    def __str__(self):
        return self.name
# Модель курса
class Course(models.Model):
    name = models.CharField(max_length=100, default="1 КУРС")

    def __str__(self):
        return self.name
# Модель корпуса
class Building(models.Model):
    name = models.CharField(max_length=100, default="ОСНОВНОЙ КУРС")

    def __str__(self):
        return self.name
# Модель отделения
class Department(models.Model):
    name = models.CharField(max_length=100, default="ОИТ")

    def __str__(self):
        return self.name
# Переопределенная модель пользователя
class User(AbstractUser):
    image = models.ImageField(upload_to='imagesUser/', null=True, blank=True)
    sur_name = models.CharField(max_length=50,default=None,null=True, blank=True)
    description = models.TextField(default='Ищу друзей', null=True,blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, default=None, null=True,blank=True)
    building = models.ForeignKey(Building, on_delete=models.CASCADE,default=None, null=True,blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE,default=None, null=True,blank=True)
    is_search_friend = models.BooleanField(default=False)
    is_search_love = models.BooleanField(default=False)
    vk_contact = models.CharField(max_length=200, default=None, null=True, blank=True)
    tg_contact = models.CharField(max_length=200, default=None, null=True,blank=True)
    hobbies = models.ManyToManyField(Hobby,blank=True)
    is_boy = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'User' # Название в единственном числе
        verbose_name_plural = 'Users' # название модели в общем списке

# Модель списка жалоб
class ComplaintList(models.Model):
    complaint_type = models.ForeignKey(ComplaintTypes, on_delete=models.CASCADE)
    author_complaint = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author_complaint')
    imposter_complaint = models.ForeignKey(User, on_delete=models.CASCADE, related_name='imposter_complaint')

    def __str__(self):
        return f" Жалоба {self.author_complaint} на {self.imposter_complaint}  Причина - {self.complaint_type.name} "

# Модель всех свайпов
class Swipe(models.Model):
    swiper = models.ForeignKey(User, on_delete=models.CASCADE, related_name='swiper')
    swiped = models.ForeignKey(User, on_delete=models.CASCADE, related_name='swiped')

    def __str__(self):
        return f"{self.swiper.last_name} свайпнул {self.swiped.last_name}"

# Модель взаимных свайпов
class SwipeMatch(models.Model):
    first_swiper = models.ForeignKey(User, on_delete=models.CASCADE, related_name='first_swiper')
    second_swiper = models.ForeignKey(User, on_delete=models.CASCADE, related_name='second_swiper')


