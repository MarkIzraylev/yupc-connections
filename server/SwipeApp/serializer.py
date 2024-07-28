from rest_framework import serializers

from SwipeApp.models import Hobby, Swipe, SwipeMatch, User, Course, Building, Department, ComplaintList, ComplaintTypes

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    sur_name =serializers.CharField(max_length=100)
    image = serializers.ImageField()
    description = serializers.CharField(max_length=200)
    course_name = serializers.SerializerMethodField(source='course_ud')
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
    identifier_swiped = serializers.IntegerField()
    is_swiped_like = serializers.BooleanField()

    def create(self, validated_data):
        # здесь захардкоржен айди свайпера
        swiped_user = User.objects.get(id=2)
        new_swipe = Swipe.objects.create(swiper=swiped_user,
                             swiped=User.objects.get(id=validated_data['identifier_swiped']),
                             is_swiped_like=validated_data['is_swiped_like'])
        if new_swipe.is_swiped_like:
            if Swipe.objects.filter(swiper=User.objects.get(id=validated_data['identifier_swiped']),  swiped=swiped_user, is_swiped_like=True).exists():
                print("мы нашли ваш свайп!")
                # вот здесь может быть потом баг, если они друг друга свайпнут одновременно и создастся две записи в бд
                SwipeMatch.objects.create(first_swiper=swiped_user,second_swiper=User.objects.get(id=validated_data['identifier_swiped']))
        #     else:
        #         print("К сожалению, не взаимно(")
        # else:
        #     print("Ты был против вашей любви")
        #
        return new_swipe

class ComplaintsListSerializer(serializers.Serializer):
    id_complaint = serializers.IntegerField(source='id')
    name = serializers.CharField(max_length=150)

class SwipesMatchListSerializer(serializers.Serializer):
    user= serializers.SerializerMethodField()
    id = serializers.IntegerField(read_only=True )
    last_name = serializers.CharField(read_only=True)
    first_name = serializers.CharField( read_only=True)
    description = serializers.CharField( read_only=True)
    image = serializers.ImageField(read_only=True)

    def get_user(self, obj):
        return User.objects.get(id=obj.id)
    def to_representation(self, instance):
        return {
            "id": instance.id,
            "first_name":instance.first_name,
            "last_name":instance.last_name,
            "description":instance.description,
            'image': str(instance.image),
        }
class SendComplaintSerializer(serializers.Serializer):
        id_complaint = serializers.IntegerField() # айди жалобы
        id_imposter = serializers.IntegerField()
        def create(self, validated_data):
            complaint_obj =     ComplaintTypes.objects.get(id=validated_data['id_complaint'])
            author_obj = User.objects.get(id=2)
            imposter_obj = User.objects.get(id=validated_data['id_imposter'])
            return ComplaintList.objects.create(complaint_type= complaint_obj, author_complaint = author_obj, imposter_complaint=imposter_obj)
