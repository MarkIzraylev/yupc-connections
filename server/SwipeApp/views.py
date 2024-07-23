from django.db.models import QuerySet, Q
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, Swipe
from .serializer import UserSerializer, SwipeUserSerializer
# Create your views here.

class UsersAPIView(APIView):
    def get(self,request):
        # ниже версия, которая правильная
        # list_all_user_id_system = User.objects.filter(~Q(id=request.user.id))

        list_all_user_id_system = User.objects.filter(~Q(id=User.objects.first().id)) # получение всех пользователей
        top_ten_user_for_load = [] # массив под 10 анкет
        for user in list_all_user_id_system: # бежим по всем пользователям
            # ниже версия, которая правильная
            # if not Swipe.objects.filter(swiper=request.user.ud, swiped=user.id).exists():
            if not Swipe.objects.filter(swiper=User.objects.first().id, swiped=user.id).exists(): # проверяем наличие
                                                                                # свайпа этим пользователя этого
                                                                                # пользователя
                top_ten_user_for_load.append(user)

            if len(top_ten_user_for_load)==10: # пока ограничились 10, дальше можем хоть параметром передавать
                break # выходим если набрали нужное количество анкет
        return Response({'users': UserSerializer(top_ten_user_for_load, many=True).data})

    # ниже код просто на память, потом конечно удалю!
    # def post(self,request):
    #     serializer = UserSerializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     return Response({'code_result':400})

class SwipeAPIView(APIView):
    def post(self,request):
        serializer = SwipeUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"code_result": 400})
