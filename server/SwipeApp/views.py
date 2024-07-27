from django.db.models import QuerySet, Q
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, Swipe, ComplaintTypes, SwipeMatch
from .serializer import (UserSerializer, SwipeUserSerializer, ComplaintsListSerializer,
                         SwipesMatchListSerializer, SendComplaintSerializer)# Create your views here.

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
        return Response({'users': UserSerializer(list_profile_user, many=True).data})

class InboxSwipeRequest(APIView):
    def get(self, request):
        user = User.objects.first()
        # надо бы проверить, что у нас уже не метч)
        # получаю список свайпов, которые свапнули текущего пользователя в сторону accept
        all_inbox_swipe_from_current_user = Swipe.objects.filter(swiped=user,is_swiped_like=True)

        # получаю пользователей, которые свайпнули текущего пользователя
        # list_user_who_inbox_current_user = [User.objects.get(id=swiped_user.swiper.id) for swiped_user
        #                                     in all_inbox_swipe_from_current_user]
        list_user_who_inbox_current_user = User.objects.filter(id__in=all_inbox_swipe_from_current_user.values_list('swiper'))

        # получение всех текущих метчей пользователя
        list_match_swipe_for_current_user = SwipeMatch.objects.filter(Q(first_swiper=user) | Q(second_swiper=user))
        print("все метчи - ", list_match_swipe_for_current_user, type(list_match_swipe_for_current_user))

        # # получаю пользователей, с которыми у нас случайно нету метча
        # list_user_who_inbox_current_user_and_not_in_match = list_user_who_inbox_current_user.objects.filter(~Q(id=list_match_swipe_for_current_user.values_list('first_swiper__id')) & Q(id=list_match_swipe_for_current_user.values_list('second_swiper__id')))
        # print("список - " , list_user_who_inbox_current_user_and_not_in_match)
        # Получаем ID пользователей, с которыми есть метч
        matched_users_ids = set(list_match_swipe_for_current_user.values_list('first_swiper', flat=True).union(
            list_match_swipe_for_current_user.values_list('second_swiper', flat=True)
        ))

        # Получаем пользователей, которые свайпнули текущего, но с которыми нет метча
        list_user_who_inbox_current_user_and_not_in_match = list_user_who_inbox_current_user.exclude(
            id__in=matched_users_ids)
        return  Response({"usersInbox":UserSerializer(list_user_who_inbox_current_user_and_not_in_match, many=True).data})
class SwipeAPIView(APIView):
    def post(self,request):
        serializer = SwipeUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        print("пост - ",serializer.validated_data)
        return Response({"code_result": 400})


class ComplaintsListAPIView(APIView):
    def get(self, request):
        list_all_complaints =  ComplaintTypes.objects.all()
        return Response({"complaintsList":ComplaintsListSerializer(list_all_complaints, many=True).data})
class SendComplaintAPIView(APIView):
    def post(self, request):
        serializer = SendComplaintSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"core_result": "400"})

class SwipesMatchAPIView(APIView):
    def get(self,request):
        user = User.objects.get(id=2)
        list_all_match_for_user = []
        for swipe in SwipeMatch.objects.filter(Q(first_swiper=user) |  Q(second_swiper=user)):
            new_swipe = swipe.first_swiper if not swipe.first_swiper==user else swipe.second_swiper
            list_all_match_for_user.append(new_swipe)
        return Response({"swipesMatch":   SwipesMatchListSerializer(list_all_match_for_user, many=True).data})