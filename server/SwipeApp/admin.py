from django.contrib import admin

# Register your models here.
from .models import (User, Building,ComplaintTypes,ComplaintList,Course,Department,Hobby,SwipeMatch,Swipe)

admin.site.register(User)
admin.site.register(Building)
admin.site.register(ComplaintList)
admin.site.register(ComplaintTypes)
admin.site.register(Course)
admin.site.register(Department)
admin.site.register(Hobby)
admin.site.register(Swipe)
admin.site.register(SwipeMatch)