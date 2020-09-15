from django.contrib import admin

from .models import Post,User,UserProfile,Like

# Register your models here.


from django.contrib.auth.admin import UserAdmin

admin.site.register(User,UserAdmin)
admin.site.register(Post)
admin.site.register(UserProfile)
admin.site.register(Like)

