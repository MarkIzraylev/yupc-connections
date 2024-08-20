from django.urls import path

# from .views import (UsersAPIView, SwipeAPIView, ComplaintsListAPIView,
#                             SendComplaintAPIView, )

from .views import ( UsersAPIView, SwipeAPIView, IncomingProfilesAPIView, GetMatchAPIView, GetProfileDetailsAPIView,
    ComplaintsListAPIView, SendComplaintAPIView, RegistrationAPIView, LoginAPIView, LogoutAPIView, HobbiesListAPIView,
                     DepartmentsListAPIView, CoursesListAPIView,  BuildingListAPIView, ResetSwipeAPIView, InvitationAPIView)

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('userList/', UsersAPIView.as_view()),
    path('swipeUser/',SwipeAPIView.as_view()),
    path('incomingProfiles/', IncomingProfilesAPIView.as_view()),
    path('getMatch/', GetMatchAPIView.as_view()),
    path('getDetailsAboutProfileInMatch/', GetProfileDetailsAPIView.as_view()),
    path('getHobbies/', HobbiesListAPIView.as_view()),
    path('getDepartments/', DepartmentsListAPIView.as_view()),
    path('getBuildings/', BuildingListAPIView.as_view()),
    path('getCourses/', CoursesListAPIView.as_view()),
    path('getComplaints/',ComplaintsListAPIView.as_view()),
    path('sendReport/', SendComplaintAPIView.as_view()),
    path('registration/',  RegistrationAPIView.as_view()),
    path('resetMatch/', ResetSwipeAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('logout/', LogoutAPIView.as_view()),
    path('token/refresh/',   TokenRefreshView.as_view(), name="token_refresh"),
    path('invitation/', InvitationAPIView.as_view() )
]