from django.urls import path

# from .views import (UsersAPIView, SwipeAPIView, ComplaintsListAPIView,
#                             SendComplaintAPIView, )

from .views import UsersAPIView, SwipeAPIView, IncomingProfilesAPIView, GetMatchAPIView, GetProfileDetailsAPIView, \
    ComplaintsListAPIView, SendComplaintAPIView

urlpatterns = [
    path('userList/', UsersAPIView.as_view()), # получение
    path('swipe/',SwipeAPIView.as_view()),
    path('incomingProfiles/', IncomingProfilesAPIView.as_view()),
    path('getMatch/', GetMatchAPIView.as_view()),
    path('getDetailsAboutProfile/', GetProfileDetailsAPIView.as_view()),
    path('complaintsList/',ComplaintsListAPIView.as_view()),
    path('sendReport/', SendComplaintAPIView.as_view())
]