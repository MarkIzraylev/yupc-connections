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
    TargetUserIdSerializer, ComplaintsListSerializer, SendComplaintSerializer, UserNewSerializer, HobbiesListSerializer,
                         DepartmentsListSerializer, CoursesListSerializer, BuildingsListSerializer, ResetSwipeSerializer,
                         InvitationUserSerializer, UserSerializerMatch)

class UsersAPIView(APIView):
    """
    Получение пользователей для свайпов <= 10
    """
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            count_profiles_need = 10 # константа количества анкет для пользователя
            target_user = request.user  # пользователей, для которого делаем запрос

            list_profiles_without_current_user = User.objects.filter(~Q(id=target_user.id)) # получение всех профилей, кроме нашего

            final_list_profiles = [] # список <= count_profiles_need анкет для пользователя
            for user in list_profiles_without_current_user:  # бежим по всем пользователям

                if not Swipe.objects.filter(swiper=target_user.id,
                                            swiped=user.id, swiper_is_like__in=[False,True]).exists() and not Swipe.objects.filter(swiper=user.id,swiped=target_user.id, swiped_is_like__in=[False,True]).exists():  # проверяем наличие свайпа этим пользователя этого

                    final_list_profiles.append(user)

                    # final_list_profiles.append({
                    #     "image": user.image,
                    #     "description": user.description,
                    #     "course": user.course,
                    #     "building": user.building,
                    #     "department": user.department,
                    #     "is_search_friend": user.is_search_friend,
                    #     "is_serach_love": user.is_search_love
                    #     "last_name": user.last_name,
                    #     "first_name": user.first_name,
                    #     ""
                    # })

                if len(final_list_profiles) == count_profiles_need:
                    break  # выходим если набрали нужное количество анкет

            users_with_serializer = UserSerializerBase(final_list_profiles, many=True).data

            if not len(users_with_serializer):
                return Response({"status_message":"Анкеты кончились"}, status=status.HTTP_404_NOT_FOUND)

            return Response({"users":users_with_serializer},status=status.HTTP_200_OK)

        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class SwipeAPIView(APIView):
    """
    Свайп анкеты
    """
    permission_classes = [IsAuthenticated]
    def post(self,request):
        try:
            serializer = SwipeUserSerializer(data=request.data, context={"request":request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as error:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ResetSwipeAPIView(APIView):
    def post(self,request):
        try:
            serializer  = ResetSwipeSerializer(data=request.data, context={'request':request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as error:
            print(error)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class IncomingProfilesAPIView(APIView):
    """
    Получение входящих анкет
    """
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            target_user = request.user
            list_incoming_profiles = Swipe.objects.filter(swiped=target_user, swiped_is_like__isnull=True).values_list(
                'swiper__id')
            final_profiles = []
            for user_swipe_id in list_incoming_profiles:
                user_target = User.objects.get(id=user_swipe_id[0])
                final_profiles.append(user_target)
            list_incoming_profiles_with_serializer = UserSerializerBase(final_profiles, many=True).data
            if not len(list_incoming_profiles_with_serializer):
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(
                {
                    "users": list_incoming_profiles_with_serializer
                },
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class GetMatchAPIView(APIView):
    """
    Получение метчей пользователя
    """
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            target_user = request.user
            list_match_profiles_when_target_user_is_swiper = list(
                Swipe.objects.filter(swiper=target_user, swiper_is_like=True, swiped_is_like=True).values_list(
                    'swiped__id'))
            list_match_profiles_when_target_user_is_swiped = list(
                Swipe.objects.filter(swiped=target_user, swiper_is_like=True, swiped_is_like=True).values_list(
                    'swiper__id'))
            list_identifiers = list_match_profiles_when_target_user_is_swiper + list_match_profiles_when_target_user_is_swiped
            final_profiles = []
            for user_swipe_id in list_identifiers:
                user_target = User.objects.get(id=user_swipe_id[0])
                final_profiles.append({
                    "id": user_target.id,
                    "last_name": user_target.last_name,
                    "first_name": user_target.first_name,
                    "image": user_target.image,
                    "description": user_target.description,
                })
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
            return Response(status.HTTP_400_BAD_REQUEST)

class GetProfileDetailsAPIView(APIView):
    """
    Получение детальной информации про пользователю
    тут жесткий код
    """
    permission_classes = [IsAuthenticated]
    def post(self,request):
       try:
           serializer = TargetUserIdSerializer(data=request.data)
           serializer.is_valid(raise_exception=True)
           target_user_id = serializer.validated_data['target_user_id']

           # Проверка, а если ли этот пользователь у меня в метчах
           target_user = request.user
           list_match_profiles_when_target_user_is_swiper = list(
               Swipe.objects.filter(swiper=target_user, swiper_is_like=True, swiped_is_like=True).values_list(
                   'swiped__id'))
           list_match_profiles_when_target_user_is_swiped = list(
               Swipe.objects.filter(swiped=target_user, swiper_is_like=True, swiped_is_like=True).values_list(
                   'swiper__id'))

           list_identifiers = list_match_profiles_when_target_user_is_swiper + list_match_profiles_when_target_user_is_swiped + [(request.user.id,)]
           for user_swipe_id in list_identifiers:
               user_target = User.objects.get(id=user_swipe_id[0]) # пользователь из метчей
               if user_target.id == target_user_id:
                   break
           else:
               return Response(status=status.HTTP_404_NOT_FOUND)



           target_user = User.objects.get(id=target_user_id)
           serializer_data_user_profile = UserSerializerMatch(target_user).data

           if not len(serializer_data_user_profile):
               return  Response(status=status.HTTP_204_NO_CONTENT)

           return Response({
               "user_details": serializer_data_user_profile
           },status=  status.HTTP_200_OK)
       except Exception:
           return Response(status=status.HTTP_400_BAD_REQUEST)

class ComplaintsListAPIView(APIView):
    """
    Получение наименований вариантов жалоб
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
            return Response(status=status.HTTP_400_BAD_REQUEST)

class SendComplaintAPIView(APIView):
    """
    Отправка жалобы
    """
    permission_classes = [IsAuthenticated]
    def post(self, request):
       try:
           serializer = SendComplaintSerializer(data=request.data, context={"request":request})
           serializer.is_valid(raise_exception=True)
           serializer.save()
           return Response( status = status.HTTP_200_OK)
       except Exception:
           return Response(status=status.HTTP_400_BAD_REQUEST)

class HobbiesListAPIView(APIView):
    """
    Получение списка хобби
    """
    def get(self,request):
        try:
            list_hobbies =   Hobby.objects.all()
            serializer = HobbiesListSerializer(list_hobbies,many=True).data

            if not len(serializer):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({"hobbies": serializer},status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class BuildingListAPIView(APIView):
    """
    Получение списка корпусов
    """
    def get(self,request):
        try:
            list_buildings =   Building.objects.all()
            serializer = BuildingsListSerializer(list_buildings,many=True).data

            if not len(serializer):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({"buildings": serializer},status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class DepartmentsListAPIView(APIView):
    """
    Получение списка отделения
    """
    def get(self,request):
        try:
            list_departments =   Department.objects.all()
            serializer = DepartmentsListSerializer(list_departments,many=True).data

            if not len(serializer):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({"departments": serializer},status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class CoursesListAPIView(APIView):
    """
    Получение списка курсов
    """
    def get(self,request):
        try:
            list_courses =   Course.objects.all()
            serializer = CoursesListSerializer(list_courses,many=True).data

            if not len(serializer):
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({"courses": serializer},status=status.HTTP_200_OK)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class RegistrationAPIView(APIView):
    def post(self, request):
        serializer = UserNewSerializer(data=request.data)
        if serializer.is_valid():
            if User.objects.filter(username=serializer.validated_data['username']).exists():
                return Response({"error":"Пользователь с таким логином уже зарегистрирован"}, status=status.HTTP_409_CONFLICT)
            user = serializer.save()

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
            print("не прошли валидацию", serializer.errors)
            return Response(status=status.HTTP_502_BAD_GATEWAY)

class LoginAPIView(APIView):
    def post(self,request):
        data = request.data

        username = data.get('username', None)

        password = data.get('password', None)

        if username is None or password is None:
            return Response({'error': 'Нужен и логин, и пароль'},

                            status=status.HTTP_400_BAD_REQUEST)

        user_test = User.objects.filter(username=username)
        if user_test.exists():
            user_test = user_test[0]
            if not user_test.is_active:
                return Response(status=status.HTTP_403_FORBIDDEN)

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
    def get(self,request):
        invited_code = request.data.get('invited_code')
        try:
            uuid.UUID(invited_code)
        except Exception:
            return Response(status=status.HTTP_404_NOT_FOUND)
            pass

        invitation_object = InvitationsUser.objects.filter(code=invited_code)
        if not invitation_object.exists():
            return Response({"message":"Данное приглашение отсутствует"},status=status.HTTP_404_NOT_FOUND)

        invitation_object = invitation_object[0]
        if invitation_object.quantity_activation<1:
            return Response({"message" : "Превышено количество активаций"},status=status.HTTP_403_FORBIDDEN)

        # invitation_object.quantity_activation-=1
        # invitation_object.save()

        return Response(status=status.HTTP_200_OK)
