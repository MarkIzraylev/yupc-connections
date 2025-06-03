from django.contrib import admin
from django.utils.safestring import mark_safe
from django.contrib import messages
from django.urls import reverse
from django.utils.html import format_html
from .models import (User, Building, ComplaintTypes, ComplaintList, Course, 
                    Department, Hobby, Swipe, InvitationsUser)

class ComplaintInlineAdmin(admin.TabularInline):
    model = ComplaintList
    fields = ('imposter_complaint', 'complaint_type')
    fk_name = 'author_complaint'
    readonly_fields = ('imposter_complaint', 'complaint_type')
    extra = 0

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    def image_tag(self, obj):
        if not obj.image:
            return "Нет фото"
        return mark_safe(f"<img src='{obj.image.url}' width=200 height=200>")

    def complaints_count(self, obj):
        count = ComplaintList.objects.filter(imposter_complaint=obj).count()
        url = reverse('admin:SwipeApp_complaintlist_changelist') + f'?imposter_complaint__id__exact={obj.id}'
        return format_html('<a href="{}">{} жалоб</a>', url, count)
    
    complaints_count.short_description = 'Жалобы'

    def block_user(self, request, queryset):
        updated = queryset.update(is_blocked=True)
        self.message_user(request, f"Заблокировано {updated} пользователей")
    block_user.short_description = "Заблокировать выбранных пользователей"

    def unblock_user(self, request, queryset):
        updated = queryset.update(is_blocked=False, block_reason='')
        self.message_user(request, f"Разблокировано {updated} пользователей")
    unblock_user.short_description = "Разблокировать выбранных пользователей"

    def check_complaints(self, request, queryset):
        for user in queryset:
            complaints = ComplaintList.objects.filter(imposter_complaint=user)
            if complaints.count() >= 3 and not user.is_blocked:
                user.is_blocked = True
                user.block_reason = f"Автоматическая блокировка за {complaints.count()} жалоб"
                user.save()
                self.message_user(
                    request, 
                    f"Пользователь {user.username} заблокирован за {complaints.count()} жалоб", 
                    messages.WARNING
                )
    check_complaints.short_description = "Проверить жалобы и заблокировать"

    list_display = (
        'username', 'last_name', 'first_name', 
        'is_blocked', 'complaints_count', 'block_reason'
    )
    list_filter = ('is_blocked', 'is_boy', 'is_search_friend', 'is_search_love')
    actions = [block_user, unblock_user, check_complaints]
    fieldsets = (
        ('Основная информация', {
            'fields': (
                ('username', 'email', 'password'),
                ('last_name', 'first_name'),
                'image',
                'image_tag',
                'description'
            )
        }),
        ('Настройки поиска', {
            'fields': (
                ('is_boy', 'is_search_friend', 'is_search_love'),
            )
        }),
        ('Учебная информация', {
            'fields': (
                ('course', 'building', 'department'),
            )
        }),
        ('Контакты', {
            'fields': (
                ('vk_contact', 'tg_contact'),
            )
        }),
        ('Блокировка', {
            'fields': (
                'is_blocked',
                'block_reason'
            )
        }),
        ('Системная информация', {
            'fields': (
                'hobbies',
                'groups',
                'last_login',
                'date_joined',
                'is_active',
                'is_staff',
                'is_superuser',
                'user_permissions',
            ),
            'classes': ('collapse',)
        })
    )
    readonly_fields = ('image_tag', 'password')
    search_fields = ('username', 'last_name', 'first_name', 'email')
    ordering = ('last_name', 'first_name')
    filter_horizontal = ('hobbies', 'groups', 'user_permissions')
    inlines = (ComplaintInlineAdmin,)

@admin.register(Swipe)
class SwipeAdmin(admin.ModelAdmin):
    list_display = ('swiper', 'swiped', 'swiper_is_like', 'swiped_is_like')
    list_filter = ('swiper_is_like', 'swiped_is_like')
    search_fields = ('swiper__username', 'swiped__username')
    raw_id_fields = ('swiper', 'swiped')

@admin.register(ComplaintList)
class ComplaintListAdmin(admin.ModelAdmin):
    list_display = ('author_complaint', 'imposter_complaint', 'complaint_type',
                    'created_at_display')
    list_filter = ('complaint_type',)
    search_fields = (
        'author_complaint__username', 
        'imposter_complaint__username',
        'complaint_type__name'
    )
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at_display',)
    
    def created_at_display(self, obj):
        return obj.created_at.strftime("%Y-%m-%d %H:%M")
    created_at_display.short_description = 'Дата создания'

@admin.register(Hobby)
class HobbyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(ComplaintTypes)
class ComplaintTypesAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(InvitationsUser)
class InvitationUserAdmin(admin.ModelAdmin):
    list_display = ('code', 'quantity_activation')
    readonly_fields = ('code', 'full_link')

    def full_link(self, obj):
        return f"http://localhost:3000/signup/{obj.code}"
    full_link.short_description = "Ссылка-приглашение"
    
    fieldsets = (
        (None, {
            'fields': ('code', 'quantity_activation', 'full_link')
        }),
    )
