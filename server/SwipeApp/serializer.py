from rest_framework import serializers

from .models import Hobby, Swipe, User, Course, Building, Department, ComplaintList, ComplaintTypes

from django.db.models import QuerySet, Q

class UserSerializerBase(serializers.Serializer):
    """
        Для обработки анкет
    """
    id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    image = serializers.ImageField()
    description = serializers.CharField(max_length=170)
    course_name = serializers.SerializerMethodField(source='course')
    building_name = serializers.SerializerMethodField(source='build')
    department_name = serializers.SerializerMethodField(source='department')
    is_search_friend = serializers.BooleanField(default=True)
    is_search_love = serializers.BooleanField(default=False)
    hobbies = serializers.SerializerMethodField()

    def get_course_name(self,obj):
        return str(Course.objects.get(id=obj.get('course')))

    def get_building_name(self,obj):
        return str(Building.objects.get(id=obj.get('building')))

    def get_department_name(self,obj):
        return str(Department.objects.get(id=obj.get('department')))

    def get_hobbies(self,obj):
        print("здесь, да?", obj)
        return list(obj.get('hobbies').values_list('name',flat=True))

class UserSerializerMatch(UserSerializerBase):
    """
        Получение информации о профиле в метчах
    """
    vk_contact = serializers.CharField(max_length=100)
    tg_contact = serializers.CharField(max_length=100)

class UserSerializerProfile(UserSerializerBase):
    vk_contact = serializers.CharField(max_length=100)
    tg_contact = serializers.CharField(max_length=100)

class SwipeUserSerializer(serializers.Serializer):
    """
        Для свайпа анкеты
    """
    target_user_id = serializers.IntegerField()
    is_like = serializers.BooleanField()

    def create(self, validated_data):

        # получаем объект того, кто свайпает
        swiper_user = User.objects.get(id=self.context['request'].user.id)

        # получаем объект свайпнутого
        swiped_user = User.objects.get(id=validated_data.get('target_user_id'))

        # получаем статус свайпа
        swipe_is_like = validated_data.get('is_like')

        # проверяем, не свайпнул ли нас Уже человек, который Мы хотим свайпнуть
        object_swipe = Swipe.objects.filter(swiper=swiped_user, swiped=swiper_user)
        if not object_swipe.exists():
            # создаем новый свайп
            new_swipe = Swipe.objects.create(swiper=swiper_user, swiped=swiped_user,swiper_is_like=swipe_is_like)
            return new_swipe

        # меняем статус в свайпе пользователя, который хотел свайпнуть
        object_swipe = object_swipe[0]
        object_swipe.swiped_is_like =  swipe_is_like
        object_swipe.save()
        return object_swipe

class ResetSwipeSerializer(serializers.Serializer):
    """
        Для разрыва метча навсегда +
    """

    target_user_id = serializers.IntegerField()
    def create(self, validated_data):
        # current_user = self.context['request'].user
        current_user = User.objects.first()
        target_user = User.objects.get(id=validated_data['target_user_id'])

        # ищем запись о том, не были ли мы случайно инициатором свайпа(метча)
        current_user_is_swiper_record = Swipe.objects.filter(swiper=current_user,swiped=target_user)
        if current_user_is_swiper_record.exists():
            cur = current_user_is_swiper_record[0]
            cur.swiper_is_like = False
            cur.save()
            return current_user_is_swiper_record
        # ищем запись о том, что мы свайпали
        current_user_is_swiped_record = Swipe.objects.filter(swiper=target_user, swiped=current_user)
        if current_user_is_swiped_record.exists():
            cur = current_user_is_swiped_record[0]
            cur.swiped_is_like = False
            cur.save()
            return cur
        return None

class MatchListSerializer(serializers.Serializer):
    """
        Для обработки анкет в метчах +
    """
    id = serializers.IntegerField()
    last_name = serializers.CharField(max_length=100)
    first_name = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=170)
    image = serializers.ImageField()

class TargetUserIdSerializer(serializers.Serializer):
    target_user_id = serializers.IntegerField()

class ComplaintsListSerializer(serializers.Serializer):
    """
        Для получения  списка жалоб +
    """

    id = serializers.IntegerField()
    name = serializers.CharField(max_length=50)

class SendComplaintSerializer(serializers.Serializer):
    """
         Для отправки жалобы +
    """

    target_user_id = serializers.IntegerField()
    complaint_id = serializers.IntegerField() # айди жалобы

    def create(self, validated_data):
        complaint_obj = ComplaintTypes.objects.get(id=validated_data['complaint_id'])
        author_obj = self.context['request'].user
        imposter_obj = User.objects.get(id=validated_data['target_user_id'])
        return ComplaintList.objects.create(complaint_type= complaint_obj, author_complaint = author_obj,
                                            imposter_complaint=imposter_obj)

class HobbiesListSerializer(serializers.Serializer):
    """
        Для получения списка хобби +
    """

    id = serializers.IntegerField()
    name = serializers.CharField(max_length=50)

class DepartmentsListSerializer(serializers.Serializer):
    """
        Для получения списка отделений +
    """

    id = serializers.IntegerField()
    name = serializers.CharField(max_length=50)

class BuildingsListSerializer(serializers.Serializer):
    """
        Для получения списка корпусов +
    """
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=50)

class CoursesListSerializer(serializers.Serializer):
    """
        Для получение списка курсов +
    """
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=50)


class UserFullData(serializers.Serializer):
    """
        Для создания нового аккаунта
    """

    username = serializers.CharField(max_length=100)
    email = serializers.CharField(max_length=100)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=170 )
    course = serializers.CharField(max_length=50)
    building = serializers.CharField(max_length=50)
    department = serializers.CharField(max_length=50)
    is_search_friend = serializers.BooleanField(default=True)
    is_search_love = serializers.BooleanField(default=False)
    vk_contact = serializers.CharField(max_length=100, required=False )
    tg_contact = serializers.CharField(max_length=100, required=False)
    hobbies = serializers.ListField(child=serializers.IntegerField(), write_only=True)
    password = serializers.CharField(max_length=150)
    image = serializers.ImageField(required=True)
    invitation_code = serializers.UUIDField()

    def create(self, validated_data):
        new_user = User(
            username=validated_data['email'], # здесь потом убрать
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            description=validated_data['description'],
            course=Course.objects.get(id=validated_data["course"]),
            building=Building.objects.get(id=validated_data['building']),
            department=Department.objects.get(id=validated_data['department']),
            is_search_friend=validated_data['is_search_friend'],
            is_search_love=validated_data['is_search_love'],
            vk_contact=validated_data['vk_contact'],
            tg_contact=validated_data['tg_contact'],
            image=validated_data['image']
        )
        
        new_user.set_password(validated_data['password'])
        new_user.save()
        for hobby_id in validated_data['hobbies']:
            hobby = Hobby.objects.get(id=hobby_id)
            new_user.hobbies.add(hobby)
        return new_user

class UserDataForPersonalAccount(UserSerializerBase):
    """
        Получение данных личного кабинета +
    """
    username = serializers.CharField(max_length=200)
    password = serializers.CharField(max_length=200)
    email = serializers.CharField(max_length=200)
    vk_contact = serializers.CharField(max_length=100, required=False)
    tg_contact = serializers.CharField(max_length=100, required=False)

class InvitationUserSerializer(serializers.Serializer):
    code = serializers.UUIDField()

