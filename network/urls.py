
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:username>/",views.profile,name="profile"),
    path("posts",views.fetchPost,name="posts"),
    path("create",views.create,name="create"),
    path("edit/<int:post_id>/",views.editNewPost,name="edit"),
    path("user",views.loggedinuser,name="user"),
    path("follower",views.fetchFollowers,name="follower"),
    path("add",views.addUserProfiles,name="add"),
    path("delete",views.delete,name="delete"),
    path("main/<str:username>/",views.mainprofile,name="profileFromNavigation"),
    path("following",views.following,name="followingPeoplePost")

]
