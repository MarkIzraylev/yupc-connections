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

from .serializer import UserSerializer, SwipeUserSerializer, IncomingProfilesSerializer, MatchListSerializer, \
    TargetUserIdSerializer, ComplaintsListSerializer, SendComplaintSerializer, UserNewSerializer

class UsersAPIView(APIView):
    """
    Получение пользователей для свайпов <= 10
    """
    permission_classes = [IsAuthenticated]
    def get(self,request):

        try:
            # ниже версия, которая правильная
            # list_all_user_id_system = User.objects.filter(~Q(id=request.user.id))
            # if not Swipe.objects.filter(swiper=request.user.ud, swiped=user.id).exists():

            # константа количества анкет для пользователя
            count_profiles_need = 10

            # пользователей, для которого делаем запрос
            target_user = User.objects.last()
            # получение всех профилей, кроме нашего
            list_profiles_without_current_user = User.objects.filter(~Q(id=target_user.id))
            # список <= count_profiles_need анкет для пользователя
            final_list_profiles = []
            for user in list_profiles_without_current_user:  # бежим по всем пользователям

                if not Swipe.objects.filter(swiper=target_user.id,
                                            swiped=user.id).exists():  # проверяем наличие
                    # свайпа этим пользователя этого
                    final_list_profiles.append(user)

                if len(final_list_profiles) == count_profiles_need:
                    break  # выходим если набрали нужное количество анкет

            users_with_serializer = UserSerializer(final_list_profiles, many=True).data
            status = "200"
            if not len(users_with_serializer):
                status = "204"
            return Response(
                {
                     "status": status,
                     'users': users_with_serializer
                 }
             )
        except Exception as error:
            print(error)
            return Response({"status":"500"})

class SwipeAPIView(APIView):
    """
    Свайп анкеты
    """
    permission_classes = [IsAuthenticated]
    def post(self,request):
        print("пользователь -", request.user)
        try:
            serializer = SwipeUserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"status":"200"})
        except Exception as error:
            print(error)
            return Response({
                "status": "500",
            })

class IncomingProfilesAPIView(APIView):
    """
    Получеге входящих анкет
    """
    permission_classes = [IsAuthenticated]
    def get(self,request):
        target_user =  User.objects.get(username="admin")
        list_incoming_profiles = Swipe.objects.filter(swiped=target_user,swiped_is_like__isnull=True).values_list('swiper__id')
        final_profiles = []
        for user_swipe_id in list_incoming_profiles:
            user_target = User.objects.get(id=user_swipe_id[0])
            final_profiles.append(user_target)
        list_incoming_profiles_with_serializer  = IncomingProfilesSerializer(final_profiles,many = True).data
        status = "200"
        if not len(list_incoming_profiles_with_serializer):
            status = "204"
        return Response(
            {
                "status": status,
                "users": list_incoming_profiles_with_serializer
            }
        )

class GetMatchAPIView(APIView):
    """
    Получение метчей пользователя
    """
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            target_user = User.objects.get(username="admin")
            list_identifiers = []

            # list_match_profiles_when_target_user_is_swiper = Swipe.objects.filter(Q((Q(swiper=target_user) | Q(swiped = target_user))) &  Q(swiper_is_like=True, swiped_is_like=True) ).values_list('swiper__id')

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
                    "sur_name": user_target.sur_name,
                    "first_name": user_target.first_name,
                    "image": user_target.image
                })
            list_match_profiles_with_serializer = MatchListSerializer(final_profiles, many=True).data
            status = "200"
            if not len(list_match_profiles_with_serializer):
                status = "204"
            return Response(
                {
                    "status": status,
                    "users": list_match_profiles_with_serializer
                }
            )
        except Exception as error:
            print(error)
            return Response({"status": "500" })

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
           status = "200"
           if not len(serializer_data_user_profile):
               status = "204"

           return Response({
               "status": status,
               "user_details": serializer_data_user_profile
           })
       except Exception as error:
           print(error)
           return Response({"status" : "500"})

class ComplaintsListAPIView(APIView):
    """
    Получение наименований вариантов жалоб
    """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            list_all_complaints = ComplaintTypes.objects.all()
            serializer_list = ComplaintsListSerializer(list_all_complaints, many=True).data
            status = "200"
            if not len(serializer_list):
                status = "204"
            return Response({
                "status":status,
                "complaint_list":  serializer_list
            })
        except Exception as error:
            print(
                error
            )
            return Response({
                "status":"500",
            })

class SendComplaintAPIView(APIView):
    """
    Отправка жалобы
    """
    permission_classes = [IsAuthenticated]
    def post(self, request):
       try:
           serializer = SendComplaintSerializer(data=request.data)
           serializer.is_valid(raise_exception=True)
           serializer.save()
           return Response({"status":"200"})
       except Exception as error:
           print(error)
           return  Response({
               "status": "500",
           })


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
            return Response( {
                "refresh":str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

        else:
            print("не прошли валидацию")
            print(serializer.errors)
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
    permission_classes = [IsAuthenticated]
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