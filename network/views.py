from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,redirect
from django.urls import reverse
from .models import User, UserProfile,Post
import json
from django.http import JsonResponse
from .forms import PostForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required



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
    # loggedinuser=str(request.user)
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

    # context={'follower':followers,'i':i,'j':j,'username':username,'posts':PostBox,'loggedinuser':loggedinuser}
    return JsonResponse([post.serialize() for post in PostBox], safe=False)
    

def fetchPost(request):
    # Filter emails returned based on mailbox
 
    posts = Post.objects.all()
       

    # Return emails in reverse chronologial order
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)



def create(request):
    if request.method !='POST':
        #No data submitted; create a blank form.
        form= PostForm()
    else:
        #Post data submitted; process data.
        form=PostForm(request.POST,request.FILES)
        if form.is_valid():
            new_post=form.save(commit=False)
            new_post.post_owner=request.user
            new_post.save()
            return redirect('index')
    context={'form':form}
    return render(request,"network/createpost.html",context)

@csrf_exempt
def editNewPost(request,post_id):



    print(post_id)


     # Query for requested email
    try:
        post = Post.objects.get(post_owner=request.user, pk=post_id)
        print(post)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    # Composing a new email must be via POST
    if request.method != "PUT":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Check recipient emails
    data = json.loads(request.body)

    print(data)


     
    post_id=data.get("id","")
    image=data.get("post_image","")
    content = data.get("post_content", "")
    time=data.get("timestamp","")



   


    post=Post(
        id=post_id,
        post_owner=request.user,
        post_image=image,
        post_content=content,
        timestamp=time
    )

   
    post.save()
       

    return JsonResponse({"message": "Post Updated successfully."}, status=201)

def loggedinuser(request):

    user=str(request.user)
    return JsonResponse({"user":user}, status=201)


def fetchFollowers(request):
    # Filter emails returned based on mailbox
 
    userprofile = UserProfile.objects.all()

       

    # Return emails in reverse chronologial order
    userprofile =userprofile.order_by("-id").all()
    return JsonResponse([follower.serialize() for follower in userprofile], safe=False)
    
    
@csrf_exempt
def addUserProfiles(request):

     # Query for requested email
    try:
        profile = UserProfile.objects.all()
        
    except UserProfile.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    # Composing a new email must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)


    data = json.loads(request.body)
   

    following=data.get("following","")
  
    mainUser=[]

    user=User.objects.all()
    for f in user:
        if str(f.username)==following:
            mainUser.append(f)
            following_id=f.id

        if str(request.user)==str(f.username):
            follower_id=f.id


    


    print(request.user)
    print(mainUser[0])
    print(follower_id)
    print(following_id)
   


    profile=UserProfile(

        follower=request.user,
        follower_id=follower_id,
        following=mainUser[0],
        following_id=following_id
    )

    

    


    profile.save()
       

    return JsonResponse({"message": "Post Updated successfully."}, status=201)



@csrf_exempt
def delete(request):
    # deleting a userprofile must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    following=data.get("following","")
    mainUser=[]
    user=User.objects.all()
    for f in user:
        if str(f.username)==following:
            mainUser.append(f)
            following_id=f.id

        if str(request.user)==str(f.username):
            follower_id=f.id

    try:
        profile = UserProfile.objects.filter(
        follower=request.user,
        follower_id=follower_id,
        following=mainUser[0],
        following_id=following_id
        )
        
    except UserProfile.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    profile.delete()
       

    return JsonResponse({"message": "Post Updated successfully."}, status=201)



def mainprofile(request,username):
    followers=UserProfile.objects.all()
    posts=Post.objects.all()
    posts=posts.order_by("-timestamp").all()
    # loggedinuser=str(request.user)
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
    postcount=len(PostBox)
    print(postcount)

    context={'follower':followers,'i':i,'j':j,'username':username,'posts':PostBox,'loggedinuser':loggedinuser,'postcount':postcount}
    return render(request,"network/profile.html",context)


def following(request):

    userprofile=UserProfile.objects.all()
    totalFollowedUser=[]
    for profile in userprofile:
        if profile.follower == request.user:
            totalFollowedUser.append(profile)
    

    print(totalFollowedUser)
    print(totalFollowedUser[0].following)
    

    posts=Post.objects.all()
    onlyPost=[]
   
    for followedUser in totalFollowedUser:
        for post in posts:
            if post.post_owner==followedUser.following:
                onlyPost.append(post)

    
    print(onlyPost)
    context={'posts':onlyPost}
    return render(request,"network/following.html",context)


