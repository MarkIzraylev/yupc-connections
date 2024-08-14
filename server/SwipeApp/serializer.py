from rest_framework import serializers

from .models import Hobby, Swipe, User, Course, Building, Department, ComplaintList, ComplaintTypes

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    sur_name = serializers.CharField(max_length=100)
    image = serializers.ImageField()
    description = serializers.CharField(max_length=200)
    course_name = serializers.SerializerMethodField(source='course_id')
    building_name = serializers.SerializerMethodField(source='build_id')
    department_name = serializers.SerializerMethodField(source='department_id')
    is_search_friend = serializers.BooleanField(default=True)
    is_search_love = serializers.BooleanField(default=False)
    vk_contact = serializers.CharField(max_length=100)
    tg_contact = serializers.CharField(max_length=100)
    hobbies = serializers.SerializerMethodField()

    def get_course_name(self,obj):
        return str(Course.objects.get(id=obj.course_id))

    def get_building_name(self,obj):
        return str(Building.objects.get(id=obj.building_id))

    def get_department_name(self,obj):
        return str(Department.objects.get(id=obj.department_id))

    def get_hobbies(self,obj):
        return list(obj.hobbies.all().values_list('name',flat=True))



class SwipeUserSerializer(serializers.Serializer):
    target_user_id = serializers.IntegerField()
    is_like = serializers.BooleanField()
    def create(self, validated_data):
        # получаем объект того, кто свайпает
        swiper_user = User.objects.get(username="admin")

        # получаем объект свайпнутого
        swiped_user = User.objects.get(id=validated_data.get('target_user_id'))

        # получаем статус свайпа
        swipe_is_like = validated_data.get('is_like')

        # проверяем наличие свайпа свайпера
        object_swipe = Swipe.objects.filter(swiper=swiped_user, swiped=swiper_user)
        if not object_swipe.exists():
            new_swipe = Swipe.objects.create(swiper=swiper_user, swiped=swiped_user,swiper_is_like=swipe_is_like)
            return new_swipe
        object_swipe = object_swipe[0]
        object_swipe.swiped_is_like =  swipe_is_like
        object_swipe.save()
        return object_swipe

class IncomingProfilesSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    sur_name = serializers.CharField(max_length=100)
    image = serializers.ImageField()
    description = serializers.CharField(max_length=200)
    course_name = serializers.SerializerMethodField(source='course_id')
    building_name = serializers.SerializerMethodField(source='build_id')
    department_name = serializers.SerializerMethodField(source='department_id')
    is_search_friend = serializers.BooleanField(default=True)
    is_search_love = serializers.BooleanField(default=False)
    vk_contact = serializers.CharField(max_length=100)
    tg_contact = serializers.CharField(max_length=100)
    hobbies = serializers.SerializerMethodField()

    def get_course_name(self, obj):
        return str(Course.objects.get(id=obj.course_id))

    def get_building_name(self, obj):
        return str(Building.objects.get(id=obj.building_id))

    def get_department_name(self, obj):
        return str(Department.objects.get(id=obj.department_id))

    def get_hobbies(self, obj):
        return list(obj.hobbies.all().values_list('name', flat=True))

class MatchListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    sur_name = serializers.CharField(max_length=100)
    first_name = serializers.CharField(max_length=100)
    image = serializers.ImageField()


class TargetUserIdSerializer(serializers.Serializer):
    target_user_id = serializers.IntegerField()


class ComplaintsListSerializer(serializers.Serializer):
    id_complaint = serializers.IntegerField(source='id')
    name = serializers.CharField(max_length=150)

class SendComplaintSerializer(serializers.Serializer):
        target_user_id = serializers.IntegerField()
        complaint_id = serializers.IntegerField() # айди жалобы

        def create(self, validated_data):
            complaint_obj = ComplaintTypes.objects.get(id=validated_data['complaint_id'])
            author_obj = User.objects.get(username="admin")
            imposter_obj = User.objects.get(id=validated_data['target_user_id'])
            return ComplaintList.objects.create(complaint_type= complaint_obj, author_complaint = author_obj, imposter_complaint=imposter_obj)




class UserNewSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100, required=False)
    last_name = serializers.CharField(max_length=100, required=False)
    sur_name = serializers.CharField(max_length=100, required=False)
    description = serializers.CharField(max_length=200 , required=False)
    course_name = serializers.SerializerMethodField(source='course_id', required=False)
    building_name = serializers.SerializerMethodField(source='build_id', required=False)
    department_name = serializers.SerializerMethodField(source='department_id', required=False)
    is_search_friend = serializers.BooleanField(default=True, required=False)
    is_search_love = serializers.BooleanField(default=False, required=False)
    vk_contact = serializers.CharField(max_length=100, required=False)
    tg_contact = serializers.CharField(max_length=100, required=False)
    hobbies = serializers.SerializerMethodField(required=False)
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=150)
    def create(self, validated_data):
        new_user = User(
            username=validated_data['username'],
        )
        new_user.set_password(validated_data['password'])
        new_user.save()
        return new_user
