from django.db.models import QuerySet, Q
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, Swipe
from .serializer import UserSerializer, SwipeUserSerializer
# Create your views here.

class UsersAPIView(APIView):
    def get(self,request, count_profile_need):
        print("count = ", count_profile_need)
        # ниже версия, которая правильная
        # list_all_user_id_system = User.objects.filter(~Q(id=request.user.id))

        list_all_user_id_system = User.objects.filter(~Q(id=User.objects.first().id)) # получение всех пользователей
        list_profile_user = [] # массив под  count_profile_need анкет
        for user in list_all_user_id_system: # бежим по всем пользователям
            # ниже версия, которая правильная
            # if not Swipe.objects.filter(swiper=request.user.ud, swiped=user.id).exists():
            if not Swipe.objects.filter(swiper=User.objects.first().id, swiped=user.id).exists(): # проверяем наличие
                                                                                # свайпа этим пользователя этого
                list_profile_user.append(user)
            if len(list_profile_user)==count_profile_need:
                break # выходим если набрали нужное количество анкет
            print("вернуло -" , UserSerializer(list_profile_user, many=True), sep='\n')
        return Response({'users': UserSerializer(list_profile_user, many=True).data})

class SwipeAPIView(APIView):
    def post(self,request):
        serializer = SwipeUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"code_result": 400})
