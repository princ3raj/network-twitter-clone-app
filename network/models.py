from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass



class Post(models.Model):

    post_owner= models.ForeignKey(User,related_name='post_by', on_delete=models.CASCADE)
    post_image=models.ImageField(null=True,blank=True)
    post_content=models.CharField(max_length=200, blank=True, null=True)
    timestamp=models.DateTimeField(auto_now_add=True)
    liked=models.BooleanField(default=False)

    @property
    def imageURL(self):
        try:
            url=self.post_image.url
        except:
            url=''
        return url


    

    def __str__(self):
        return self.post_content

    def serialize(self):
        return {
            "id": self.id,
            "post_owner": self.post_owner.username,
            "post_image":self.post_image.url,
            "post_content": self.post_content,
            "timestamp": self.timestamp,
            "liked":self.liked
        }




class UserProfile(models.Model):
    follower = models.ForeignKey(User, related_name='following',on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='followers',on_delete=models.CASCADE)



    
    class Meta:
        unique_together = ('follower', 'following')

    def __unicode__(self):
        return u'%s follows %s' % (self.follower, self.following)

    def serialize(self):
        return {
            "follower_id": self.follower_id,
            "following_id":self.following_id,
            "follower": self.follower.username,
            "following":self.following.username
           
        }

class Like(models.Model):
    like=models.ForeignKey("Post", related_name="like_count", on_delete=models.CASCADE)

  


    



