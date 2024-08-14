from django.urls import path

# from .views import (UsersAPIView, SwipeAPIView, ComplaintsListAPIView,
#                             SendComplaintAPIView, )

from .views import UsersAPIView, SwipeAPIView, IncomingProfilesAPIView, GetMatchAPIView, GetProfileDetailsAPIView, \
    ComplaintsListAPIView, SendComplaintAPIView, RegistrationAPIView, LoginAPIView, LogoutAPIView

urlpatterns = [
    path('userList/', UsersAPIView.as_view()),
    path('swipe/',SwipeAPIView.as_view()),
    path('incomingProfiles/', IncomingProfilesAPIView.as_view()),
    path('getMatch/', GetMatchAPIView.as_view()),
    path('getDetailsAboutProfile/', GetProfileDetailsAPIView.as_view()),
    path('complaintsList/',ComplaintsListAPIView.as_view()),
    path('sendReport/', SendComplaintAPIView.as_view()),
    path('registration/',  RegistrationAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('logout/', LogoutAPIView.as_view())
]