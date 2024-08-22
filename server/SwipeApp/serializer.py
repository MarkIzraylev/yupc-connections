from rest_framework import serializers

from .models import Hobby, Swipe, User, Course, Building, Department, ComplaintList, ComplaintTypes

from django.db.models import QuerySet, Q

class UserSerializerBase(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    image = serializers.ImageField()
    description = serializers.CharField(max_length=170)
    course_name = serializers.SerializerMethodField(source='course_id')
    building_name = serializers.SerializerMethodField(source='build_id')
    department_name = serializers.SerializerMethodField(source='department_id')
    is_search_friend = serializers.BooleanField(default=True)
    is_search_love = serializers.BooleanField(default=False)
    hobbies = serializers.SerializerMethodField()

    def get_course_name(self,obj):
        return str(Course.objects.get(id=obj.course_id))

    def get_building_name(self,obj):
        return str(Building.objects.get(id=obj.building_id))

    def get_department_name(self,obj):
        return str(Department.objects.get(id=obj.department_id))

    def get_hobbies(self,obj):
        return list(obj.hobbies.all().values_list('name',flat=True))

class UserSerializerMatch(UserSerializerBase):
    vk_contact = serializers.CharField(max_length=100)
    tg_contact = serializers.CharField(max_length=100)


class UserSerializerProfile(UserSerializerBase):
    vk_contact = serializers.CharField(max_length=100)
    tg_contact = serializers.CharField(max_length=100)


class SwipeUserSerializer(serializers.Serializer):
    target_user_id = serializers.IntegerField()
    is_like = serializers.BooleanField()
    def create(self, validated_data):
        # получаем объект того, кто свайпает
        swiper_user = User.objects.get(id=self.context['request'].user.id)

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

class ResetSwipeSerializer(serializers.Serializer):
    target_user_id = serializers.IntegerField()
    def create(self, validated_data):
        current_user = self.context['request'].user
        target_user = User.objects.get(id=validated_data['target_user_id'])
        print("от кого запрос - ", current_user)
        print("кого отменяем - " ,target_user)
        current_user_is_swiper_record = Swipe.objects.filter(swiper=current_user,swiped=target_user)
        if current_user_is_swiper_record.exists():
            print("я был свайпером")
            cur = current_user_is_swiper_record[0]
            cur.swiper_is_like = False
            cur.save()
            return current_user_is_swiper_record
        print("тут меня свайпали")
        current_user_is_swiped_record = Swipe.objects.filter(swiper=target_user, swiped=current_user)[0]
        current_user_is_swiped_record.swiped_is_like = False
        current_user_is_swiped_record.save()
        return current_user_is_swiped_record

class MatchListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    last_name = serializers.CharField(max_length=100)
    first_name = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=170)
    image = serializers.ImageField()


class TargetUserIdSerializer(serializers.Serializer):
    target_user_id = serializers.IntegerField()


class ComplaintsListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=50)

class SendComplaintSerializer(serializers.Serializer):
        target_user_id = serializers.IntegerField()
        complaint_id = serializers.IntegerField() # айди жалобы

        def create(self, validated_data):
            complaint_obj = ComplaintTypes.objects.get(id=validated_data['complaint_id'])
            author_obj = self.context['request'].user
            imposter_obj = User.objects.get(id=validated_data['target_user_id'])
            return ComplaintList.objects.create(complaint_type= complaint_obj, author_complaint = author_obj, imposter_complaint=imposter_obj)

class HobbiesListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=50)

class DepartmentsListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=50)

class BuildingsListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=50)

class CoursesListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=50)


class UserNewSerializer(UserSerializerBase):
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
    hobbies = serializers.ListSerializer(child=serializers.IntegerField(), write_only=True)
    password = serializers.CharField(max_length=150)
    invitation_code = serializers.UUIDField()
    image = serializers.ImageField(required=True)


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
class InvitationUserSerializer(serializers.Serializer):
    code = serializers.UUIDField()