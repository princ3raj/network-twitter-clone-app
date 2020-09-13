from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, UserProfile,Post
import json
from django.http import JsonResponse



def index(request):

    posts=Post.objects.all()
    posts=posts.order_by("-timestamp").all()
    context={'posts':posts}
    
    return render(request, "network/index.html",context)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def profile(request,username):
    followers=UserProfile.objects.all()
    posts=Post.objects.all()
    posts=posts.order_by("-timestamp").all()
    loggedinuser=str(request.user)
    PostBox=[]
    for post in posts:
        if str(post.post_owner)==username:
            PostBox.append(post)

    i=0
    j=0
    print(type(username))
    for f in followers:
        if str(f.follower)==username:
            print(type(f.follower))
            i+=1
    for g in followers:
        if str(g.following)==username:
            j+=1

    print(PostBox)

    context={'follower':followers,'i':i,'j':j,'username':username,'posts':PostBox,'loggedinuser':loggedinuser}
    return render(request,"network/profile.html",context)

def fetchPost(request):
    # Filter emails returned based on mailbox
 
    posts = Post.objects.all()
       

    # Return emails in reverse chronologial order
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)
    




