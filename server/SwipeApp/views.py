from django.contrib.auth import authenticate
from django.db.models import QuerySet, Q
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# импортирование для JWT авторизации/регистрации
from rest_framework_simplejwt.tokens import  RefreshToken

from .models import User, Swipe, ComplaintTypes

from .serializer import UserSerializer, SwipeUserSerializer, MatchListSerializer, \
    TargetUserIdSerializer, ComplaintsListSerializer, SendComplaintSerializer, UserNewSerializer

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
                                            swiped=user.id).exists():  # проверяем наличие свайпа этим пользователя этого
                    final_list_profiles.append(user)

                if len(final_list_profiles) == count_profiles_need:
                    break  # выходим если набрали нужное количество анкет

            users_with_serializer = UserSerializer(final_list_profiles, many=True).data
            status_for_client = status.HTTP_200_OK
            status_message = ""

            """
            При фильтрации если анкеты кончились, не забыть обработать эту ошибку
            """
            if not len(users_with_serializer):
                status_for_client = status.HTTP_404_NOT_FOUND
                status_message = "Анкеты кончились"

            if status_message:
                return Response({"message":status_message}, status = status_for_client)

            return Response({"users":users_with_serializer},status=status_for_client)

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
            list_incoming_profiles_with_serializer = UserSerializer(final_profiles, many=True).data
            status_for_client = status.HTTP_200_OK
            if not len(list_incoming_profiles_with_serializer):
                status_for_client = status.HTTP_204_NO_CONTENT
            return Response(
                {
                    "users": list_incoming_profiles_with_serializer
                },
                status=status_for_client
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
            status_for_client = status.HTTP_200_OK
            if not len(list_match_profiles_with_serializer):
                status_for_client =   status.HTTP_204_NO_CONTENT
            return Response(
                {
                    "users": list_match_profiles_with_serializer
                },
                status =   status_for_client
            )
        except Exception:
            return Response(status.HTTP_400_BAD_REQUEST)

class GetProfileDetailsAPIView(APIView):
    """
    Получение детальной информации про пользователя
    """
    permission_classes = [IsAuthenticated]
    def post(self,request):
       try:
           serializer = TargetUserIdSerializer(data=request.data)
           serializer.is_valid(raise_exception=True)
           target_user_id = serializer.validated_data['target_user_id']
           target_user = User.objects.get(id=target_user_id)
           serializer_data_user_profile = UserSerializer(target_user).data
           status_for_client = status.HTTP_200_OK
           if not len(serializer_data_user_profile):
               status_for_client = status.HTTP_204_NO_CONTENT

           return Response({
               "user_details": serializer_data_user_profile
           },status= status_for_client)
       except Exception:
           return Response(status=status.HTTP_400_BAD_REQUEST)

class ComplaintsListAPIView(APIView):
    """
    Получение наименований вариантов жалоб
    """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            list_all_complaints = ComplaintTypes.objects.all()
            serializer_list = ComplaintsListSerializer(list_all_complaints, many=True).data
            status_for_client = status.HTTP_200_OK
            if not len(serializer_list):
                status_for_client = status.HTTP_204_NO_CONTENT
            return Response({
                "complaint_list":  serializer_list
            },status=status_for_client)
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


class RegistrationAPIView(APIView):
    def post(self, request):

        serializer = UserNewSerializer(data=request.data)
        if serializer.is_valid():
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