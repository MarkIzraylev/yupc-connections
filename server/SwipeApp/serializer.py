from rest_framework import serializers

from SwipeApp.models import Hobby, Swipe, SwipeMatch, User, Course, Building, Department

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    sur_name =serializers.CharField(max_length=100)
    image = serializers.ImageField()
    description = serializers.CharField(max_length=200)
    course_name = serializers.SerializerMethodField(source='course_ud')
    # building_name = serializers.SerializerMethodField(source='build_id')
    # department_name = serializers.SerializerMethodField(source='department_id')
    is_search_friend = serializers.BooleanField(default=True)
    is_search_love = serializers.BooleanField(default=False)
    vk_contact = serializers.CharField(max_length=100)
    tg_contact = serializers.CharField(max_length=100)
    # hobbies = serializers.PrimaryKeyRelatedField(many=True)
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
    identifier_swiped = serializers.IntegerField()
    is_swiped_like = serializers.BooleanField()

    def create(self, validated_data):
        # здесь захардкоржен айди свайпера
        return Swipe.objects.create(swiper = User.objects.get(id=2),
                                    swiped = User.objects.get(id=validated_data['identifier_swiped']),
                                    is_swiped_like=validated_data['is_swiped_like'])