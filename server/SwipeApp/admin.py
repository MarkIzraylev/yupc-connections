from django.contrib import admin

# Register your models here.
from .models import (User, Building,ComplaintTypes,ComplaintList,Course,Department,Hobby,SwipeMatch,Swipe)

class ComplaintInlineAdmin(admin.TabularInline):
    model = ComplaintList
    fields = ('imposter_complaint','complaint_type')
    fk_name = 'author_complaint'
    readonly_fields = ('imposter_complaint','complaint_type')
    extra = 0
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    # поля, которые будем видеть в общем списке
    list_display = ('username','sur_name','last_name','first_name')

    # поля, которые будем видеть в каждом элементе списка + группировка
    fields = (
        ('username','email','password'),
        ('sur_name', 'last_name', 'first_name'),
        'image',
        ('is_boy', 'is_search_friend', 'is_search_love'),
        ('course', 'building', 'departament'),
        ('vk_contact', 'tg_contact'),
        'description',
        'hobbies',
        'groups',
        'last_login',
        'date_joined',
        'is_active',
        'is_staff',
        'is_superuser',
        'user_permissions',
    )

    # # поля, которые мы сможем только читать
    # readonly_fields = ('description','hobbies','last_login','date_joined','is_search_friend','image','is_search_love',
    #                    'is_boy','password','username','vk_contact','tg_contact')
    inlines = (ComplaintInlineAdmin,)

    # поля, по которым будет доступен поиск
    search_fields = ('username', 'sur_name', 'last_name', 'first_name')

    # поля, по котором сортировка(по умолчанию в алфавитном порядке/возрастанию
    # '-last_name' - сортировка в обратном порядке
    ordering = ('last_name', 'first_name')


@admin.register(Swipe)
class SwipeAdmin(admin.ModelAdmin):
    list_display = ('swiper','swiped')
    fields = (('swiper','swiped'),)
    readonly_fields = ('swiper','swiped')
@admin.register(SwipeMatch)
class SwipeAdmin(admin.ModelAdmin):
    list_display = ('first_swiper','second_swiper')
    fields = (('first_swiper','second_swiper'),)
    readonly_fields = ('first_swiper','second_swiper')

@admin.register(Hobby)
class HobbyAdmin(admin.ModelAdmin):
    pass

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    pass

@admin.register(Building)
class DepartmentAdmin(admin.ModelAdmin):
    pass

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    pass

@admin.register(ComplaintTypes)
class ComplaintTypesAdmin(admin.ModelAdmin):
    pass

@admin.register(ComplaintList)
class CourseAdmin(admin.ModelAdmin):
    fields = ('complaint_type',
              ('author_complaint','imposter_complaint'))
    readonly_fields = ('imposter_complaint','complaint_type','author_complaint')
