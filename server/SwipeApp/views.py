import uuid

from django.contrib.auth import authenticate
from django.db.models import QuerySet, Q
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# импортирование моей функции

# импортирование для JWT авторизации/регистрации
from rest_framework_simplejwt.tokens import  RefreshToken

from .models import User, Swipe, ComplaintTypes, Hobby, Department, Building, Course, InvitationsUser

from .serializer import (UserSerializerBase, SwipeUserSerializer, MatchListSerializer,
    TargetUserIdSerializer, ComplaintsListSerializer, SendComplaintSerializer, UserFullData, HobbiesListSerializer,
                         DepartmentsListSerializer, CoursesListSerializer, BuildingsListSerializer, ResetSwipeSerializer,
                         InvitationUserSerializer, UserSerializerMatch, UserDataForPersonalAccount )

class UsersAPIView(APIView):
    """
    Получение пользователей для страницы свайпов +
    """
    permission_classes = [IsAuthenticated]
    def post(self,request):
        try:
            # параметр поиска
            is_looking_friend = request.data['is_search_friend']

            # количество анкет для пользователя
            count_required_profiles = 10

            # пользователь, для которого делаем запрос
            # requesting_user = request.user
            requesting_user = User.objects.first()

            # массив анкет
            list_users = []

            # получение профилей, всех пользователей, кроме нашего и по параметру поиска
            if is_looking_friend:
                list_users = User.objects.filter(~Q(id=requesting_user.id), is_search_friend=True)
            else:
                list_users = User.objects.filter(~Q(id=requesting_user.id), is_boy=not requesting_user.is_boy,is_search_love = True)

            # конечный массив анкет для пользователя
            list_profiles = []
            for user in list_users:

                if not Swipe.objects.filter(swiper=requesting_user.id,swiped=user.id, swiper_is_like__in=[False,True]).exists():

                    list_profiles.append({
                        'id':user.id,
                        'first_name': user.first_name,
                        'last_name' : user.last_name,
                        'image': user.image,
                        'description':user.description,
                        'course':user.course.id,
                        'building':user.building.id,
                        'department':user.department.id,
                        'is_search_friend':user.is_search_friend,
                        'is_search_love':user.is_search_love,
                        'hobbies': user.hobbies
                    })

                if len(list_profiles) == count_required_profiles:
                    # выходим если набрали нужное количество анкет
                    break

            # если анкеты отсутствуют, возвращаем ошибку
            if not len(list_profiles):
                return Response(status=status.HTTP_204_NO_CONTENT)

            # список анкет, преобразованных в JSON формат для front
            list_profiles_ready_to_be_sent = UserSerializerBase(list_profiles, many=True).data

            # возвращаю анкеты
            return Response({"users":list_profiles_ready_to_be_sent},status=status.HTTP_200_OK)

        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SwipeAPIView(APIView):
    """
    Свайп анкеты +
    """
    permission_classes = [IsAuthenticated]
    def post(self,request):
        try:
            serializer = SwipeUserSerializer(data=request.data, context={"request":request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResetSwipeAPIView(APIView):
    """
    Отмена метча +
    """
    permission_classes = [IsAuthenticated]
    def post(self,request):
        try:
            # преобразуем данные из запроса и разрываем swipe
            serializer  = ResetSwipeSerializer(data=request.data, context={'request':request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        except Exception :
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class IncomingProfilesAPIView(APIView):
    """
    Получение входящих анкет +
    """
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            target_user = request.user

            # получаю айдишники пользователей, который отправили запрос на метч
            list_id_users_submitted_request = Swipe.objects.filter(swiped=target_user, swiped_is_like__isnull=True).values_list(
                'swiper__id')

            # массив пользователей до сериализатора
            list_profiles = []

            for user_swipe_id in list_id_users_submitted_request:
                user = User.objects.get(id=user_swipe_id[0])
                list_profiles.append({
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'image': user.image,
                'description': user.description,
                'course': user.course.id,
                'building': user.building.id,
                'department': user.department.id,
                'is_search_friend': user.is_search_friend,
                'is_search_love': user.is_search_love,
                'hobbies': user.hobbies
            })

            # массив анкет финальный в формате JSON
            list_profiles_users_submitted_request = UserSerializerBase(list_profiles, many=True).data

            # если нет входящих
            if not len(list_profiles_users_submitted_request):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response(
                {
                    "users": list_profiles_users_submitted_request
                },
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetMatchAPIView(APIView):
    """
    Получение метчей пользователя +
    """
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            target_user = request.user

            # получение айдишников пользователей, метч которых был инициирован текущим пользователем
            list_id_users_when_target_user_is_swiper = list(
                Swipe.objects.filter(swiper=target_user, swiper_is_like=True, swiped_is_like=True).values_list(
                    'swiped__id'))

            # получение айдишников пользователей, метч которых был иницирован не текущим пользователем
            list_id_users_when_target_user_is_swiped = list(
                Swipe.objects.filter(swiped=target_user, swiper_is_like=True, swiped_is_like=True).values_list(
                    'swiper__id'))

            # итоговый список айдишников пользователей, данные которых надо показать
            list_id_users_match = list_id_users_when_target_user_is_swiper + list_id_users_when_target_user_is_swiped

            # список пользователей обработки в JSON
            final_profiles = []

            for user_id in list_id_users_match:
                user_target = User.objects.get(id=user_id[0])
                final_profiles.append({
                    "id": user_target.id,
                    "last_name": user_target.last_name,
                    "first_name": user_target.first_name,
                    "image": user_target.image,
                    "description": user_target.description,
                })

            # список пользователей в JSON
            list_match_profiles_with_serializer = MatchListSerializer(final_profiles, many=True).data

            if not len(list_match_profiles_with_serializer):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response(
                {
                    "users": list_match_profiles_with_serializer
                },
                status = status.HTTP_200_OK
            )
        except Exception:
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetProfileDetailsAPIView(APIView):
    """
    Получение детальной информации по пользователю, если он у нас есть в метчах +
    """
    # permission_classes = [IsAuthenticated]
    def post(self,request):
       try:
           serializer = TargetUserIdSerializer(data=request.data)
           serializer.is_valid(raise_exception=True)
           target_user_id = serializer.validated_data['target_user_id']

           user_requesting = User.objects.first()

           # Проверка,есть ли этот пользователь у тебя в метчах, иначе нельзя показывать
           list_match_profiles_when_target_user_is_swiper = list(
               Swipe.objects.filter(swiper=user_requesting, swiper_is_like=True, swiped_is_like=True).values_list(
                   'swiped__id'))
           list_match_profiles_when_target_user_is_swiped = list(
               Swipe.objects.filter(swiped=user_requesting, swiper_is_like=True, swiped_is_like=True).values_list(
                   'swiper__id'))

           list_identifiers = list_match_profiles_when_target_user_is_swiper + list_match_profiles_when_target_user_is_swiped

           for user_swipe_id in list_identifiers:
               user_target = User.objects.get(id=user_swipe_id[0]) # пользователь из метчей
               if user_target.id == target_user_id:
                   break
           else:
               return Response(status=status.HTTP_404_NOT_FOUND)

           target_user = User.objects.get(id=target_user_id)
           serializer_data_user_profile = UserSerializerMatch({
                        'id':target_user.id,
                        'first_name': target_user.first_name,
                        'last_name' : target_user.last_name,
                        'image': target_user.image,
                        'description':target_user.description,
                        'course':target_user.course.id,
                        'building':target_user.building.id,
                        'department':target_user.department.id,
                        'is_search_friend':target_user.is_search_friend,
                        'is_search_love':target_user.is_search_love,
                        'vk_contact':target_user.vk_contact,
                        'tg_contact':target_user.tg_contact,
                        'hobbies': target_user.hobbies
                    }).data

           if not len(serializer_data_user_profile):
               return  Response(status=status.HTTP_204_NO_CONTENT)

           return Response({
               "user_details": serializer_data_user_profile
           },status=  status.HTTP_200_OK)

       except Exception:
           return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ComplaintsListAPIView(APIView):
    """
    Получение наименований вариантов жалоб +
    """
    def get(self, request):
        try:
            list_all_complaints = ComplaintTypes.objects.all()
            serializer_list = ComplaintsListSerializer(list_all_complaints, many=True).data

            if not len(serializer_list):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({
                "complaints":  serializer_list
            },status=status.HTTP_200_OK)

        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SendComplaintAPIView(APIView):
    """
    Отправка жалобы  +
    """
    permission_classes = [IsAuthenticated]
    def post(self, request):
       try:
           serializer = SendComplaintSerializer(data=request.data, context={"request":request})
           serializer.is_valid(raise_exception=True)
           serializer.save()
           return Response( status = status.HTTP_200_OK)
       except Exception:
           return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HobbiesListAPIView(APIView):
    """
    Получение списка хобби +
    """
    def get(self,request):
        try:
            list_hobbies =   Hobby.objects.all()
            serializer = HobbiesListSerializer(list_hobbies,many=True).data

            if not len(serializer):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({"hobbies": serializer},status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BuildingListAPIView(APIView):
    """
    Получение списка корпусов +
    """
    def get(self,request):
        try:
            list_buildings =   Building.objects.all()
            serializer = BuildingsListSerializer(list_buildings,many=True).data

            if not len(serializer):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({"buildings": serializer},status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DepartmentsListAPIView(APIView):
    """
    Получение списка отделений +
    """
    def get(self,request):
        try:
            list_departments =   Department.objects.all()
            serializer = DepartmentsListSerializer(list_departments,many=True).data

            if not len(serializer):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({"departments": serializer},status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CoursesListAPIView(APIView):
    """
    Получение списка курсов +
    """
    def get(self,request):
        try:
            list_courses =   Course.objects.all()
            serializer = CoursesListSerializer(list_courses,many=True).data

            if not len(serializer):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({"courses": serializer},status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class UpdateUserDataAPIView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def put(self,request):
#         try:
#             instance = User.objects.get(id=request.user.id)
#
#             serializer = UserFullData(instance,data=request.data)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(status=status.HTTP_200_OK)
#             else:
#                 print(serializer.errors)
#                 return Response(status=status.HTTP_400_BAD_REQUEST)
#         except Exception:
#             return Response(status=status.HTTP_502_BAD_GATEWAY)


class PersonalAccount(APIView):
    """
    Получение данных аккаунта +
    """
    def get(self,request):
        try:
            user_requesting = User.objects.filter(username='mm').first()
            serializer = UserDataForPersonalAccount({
                        'id':user_requesting.id,
                        'first_name': user_requesting.first_name,
                        'last_name' : user_requesting.last_name,
                        'image': user_requesting.image,
                        'description':user_requesting.description,
                        'course':user_requesting.course_id,
                        'building':user_requesting.building_id,
                        'department':user_requesting.department_id,
                        'is_search_friend':user_requesting.is_search_friend,
                        'is_search_love':user_requesting.is_search_love,
                        'vk_contact':user_requesting.vk_contact,
                        'tg_contact':user_requesting.tg_contact,
                        'hobbies': user_requesting.hobbies,
                        "username":user_requesting.username,
                        "password": user_requesting.password,
                        "email":user_requesting.email
                    }).data
            return Response({"user_data": serializer}, status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class RegistrationAPIView(APIView):
    def post(self, request):
        serializer = UserFullData(data=request.data)
        if serializer.is_valid():
            if User.objects.filter(username=serializer.validated_data['username']).exists():
                return Response({"error":"Пользователь с таким логином уже зарегистрирован"}, status=status.HTTP_409_CONFLICT)

            invitation_object = InvitationsUser.objects.filter(code=serializer.validated_data['invitation_code'])
            if not invitation_object.exists():
                return Response({"message": "Данное приглашение отсутствует"}, status=status.HTTP_404_NOT_FOUND)

            invitation_object = invitation_object[0]
            if invitation_object.quantity_activation < 1:
                return Response({"message": "Превышено количество активаций"}, status=status.HTTP_403_FORBIDDEN)

            invitation_object.quantity_activation-=1
            user = serializer.save()
            invitation_object.save()

            refresh = RefreshToken.for_user(user)
            refresh.payload.update({
                "user_id": user.id,
                "email": user.email
            })
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

        else:
            return Response(status=status.HTTP_502_BAD_GATEWAY)

class LoginAPIView(APIView):
    def post(self,request):
        data = request.data

        username = data.get('username', None)

        password = data.get('password', None)

        if username is None or password is None:
            return Response({'error': 'Нужен и логин, и пароль'},

                            status=status.HTTP_400_BAD_REQUEST)

        # user_test = User.objects.filter(username=username)
        # if user_test.exists():
        #     user_test = user_test[0]
        #     if not user_test.is_active:
        #         return Response(status=status.HTTP_403_FORBIDDEN)

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Неверные данные'},

                            status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        refresh.payload.update({
            "user_id": user.id,
            "email": user.email
        })

        return Response({

            'refresh': str(refresh),

            'access': str(refresh.access_token),

        }, status=status.HTTP_200_OK)

class LogoutAPIView(APIView):
    def post(self,request):
        refresh_token = request.data.get('refresh_token')  # С клиента нужно отправить refresh token

        if not refresh_token:
            return Response({'error': 'Необходим Refresh token'},

                            status=status.HTTP_400_BAD_REQUEST)
        try:

            token = RefreshToken(refresh_token)

            token.blacklist()  # Добавить его в чёрный список

        except Exception as e:

            return Response({'error': 'Неверный Refresh token'},

                            status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': 'Выход успешен'}, status=status.HTTP_200_OK)

class InvitationAPIView(APIView):
    def post(self,request):
        invited_code = request.data.get('invited_code')
        try:
            uuid.UUID(invited_code)
        except Exception:
            return Response(status=status.HTTP_404_NOT_FOUND)

        invitation_object = InvitationsUser.objects.filter(code=invited_code)
        if not invitation_object.exists():
            return Response({"message":"Данное приглашение отсутствует"},status=status.HTTP_404_NOT_FOUND)

        invitation_object = invitation_object[0]
        if invitation_object.quantity_activation<1:
            return Response({"message" : "Превышено количество активаций"},status=status.HTTP_403_FORBIDDEN)

        return Response(status=status.HTTP_200_OK)
