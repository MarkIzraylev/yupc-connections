from rest_framework import serializers

from SwipeApp.models import Hobby


class UserSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    sur_name =serializers.CharField(max_length=100)
    image = serializers.ImageField()
    description = serializers.CharField(max_length=200)
    course_id = serializers.IntegerField()
    building_id = serializers.IntegerField()
    departament_id = serializers.IntegerField()
    is_search_friend = serializers.BooleanField(default=True)
    is_search_love = serializers.BooleanField(default=False)
    vk_contact = serializers.CharField(max_length=100)
    tg_contact = serializers.CharField(max_length=100)
    hobbies = serializers.PrimaryKeyRelatedField(many=True,queryset=Hobby.objects.all())


