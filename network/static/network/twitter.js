document.addEventListener('DOMContentLoaded', function() {
  document.querySelector(".main-container").style.display='none';
    load_posts() 



    
});


function load_posts(){
  document.querySelector(".edit-post").style.display='none';
    fetch('/posts')
    .then(response => response.json())
    .then(function(posts){
      document.querySelector(".main-container").style.display='none';
      appendPosts(posts);
      
    });
}





function appendPosts(posts){
  
    var mainContainer = document.querySelector(".container");
    for(var i=0;i<posts.length;i++)
    {
        var div = document.createElement("div");
        div.className="post-styling";
        div.id=posts[i].id;
        // var link=document.createElement("div");
        // link.id=posts[i].id
        var post_owner=document.createElement("p");
        var post_image=document.createElement("img");
        var post_content=document.createElement("p");
        var post_time=document.createElement("p");
        var post_like=document.createElement("p");
        var like_button=document.createElement("img");
        post_owner.id="post-owner"
        post_image.id="post-image"
        post_image.className=posts[i].id
        like_button.className="btn-danger"
        post_content.id="post-content"
        post_time.id="post-time"
        post_like.id="post-like"
        like_button.id="ab"+posts[i].id
        
      
        // link.appendChild(post_image);
        // div.appendChild(link);
        div.appendChild(post_owner);
        div.appendChild(post_image);
        div.appendChild(post_content);
        div.appendChild(post_time);
        div.appendChild(post_like);
        div.appendChild(like_button);
        
        // link.href="profile/"+posts[i].post_owner
        post_owner.innerHTML=posts[i].post_owner;
        post_image.src=posts[i].post_image
        post_content.innerHTML=posts[i].post_content
        post_time.innerHTML=posts[i].timestamp
        var likedOrNot=posts[i].liked
        if(likedOrNot)
        {
          post_like.innerHTML=1
          like_button.src="/images/liked.png"
        }
        else{
          post_like.innerHTML=0
          like_button.src="/images/unliked.png"

        }
     
        mainContainer.appendChild(div);
       
    
    }
    document.addEventListener('click',event=>{
      const post_id=event.target.id;
      const img_class_no=event.target.className;
      const like_button_id=event.target.id;
      // var str = "ab277777"; 
      var like_id_spliced = like_button_id.slice(2);
    
      const post_owner_name=event.target.innerHTML;

      console.log(post_id)
      console.log(like_id_spliced)
      console.log(event.target)
      console.log(like_button_id==post_id)
      console.log(post_id)

      var j=1;
      var s=1;
     
            
        posts.forEach(post=>{



          s=1;



                if(like_button_id==post_id && post.id==like_id_spliced)
                {
                  newLikeFunction(like_button_id, post_id, s, post);
                  s++;
                  console.log(post_id)
                  console.log(s)
                

                }





                //if  post owner and the clicked element owner match, then go to his profile
                if(post.post_owner==post_owner_name)// Main if start here
                {
                  document.querySelector(".container").style.display='none';
                  document.querySelector("#feed").style.display='none';
            
                  //main Fetch start here
                  fetch(`/profile/${post_owner_name}/`)
                  .then(response => response.json())
                  .then(function(posts){
                    document.querySelector(".main-container").style.display='block';

                    //this logic helps that function to run for only one one time
                    if(j==1)// if j=1 start from here
                    {
                      document.querySelector("#username").innerHTML=post_owner_name;
                      document.querySelector("#posts-count").innerHTML=posts.length;
                    ///////////////// for followers and following count\\\\\\\\\\\\\\\\\\
                              fetch("/follower")
                              .then(response => response.json())
                              .then(followers=>{
                                l=0;//for follower
                                m=0;//for following
                                fetch('/user')
                                .then(response => response.json())
                                .then(username=> {
                                  var loggedinuser=username.user
                                  for(var z=0;z<followers.length;z++)
                                  {
                                    if(followers[z].following==post_owner_name && followers[z].follower==loggedinuser)
                                    {
                                      document.querySelector("#follow-unfollow-button").innerHTML="following";
                                    }
                                     /////////which user is logged in so we can hide the follow button\\\\\\\
                                    if(loggedinuser==post_owner_name)
                                    {
                                      document.querySelector("#follow-unfollow-button").style.display='none';
                                    }
                                  }
                                  followUnfollow(followers,loggedinuser,post_owner_name);
                                });

                            

                              //for loop for calculating followers and following by using l and m
                                for(var k=0;k<followers.length;k++)
                                {

                                  //using post-owner name, we can get to know,that we are calculating 
                                  //the followers and following for that specific user

                                  if(followers[k].follower==post_owner_name)
                                  {
                                    l+=1;

                                  }

                                  if(followers[k].following==post_owner_name)
                                  {
                                    m+=1;

                                  }

                                }
                                document.querySelector("#followers-count").innerHTML=m;
                                document.querySelector("#following-count").innerHTML=l;
                              //end of for loop 
                              });
                      
                      profilePostAdder(posts,post_owner_name); 
                    
                     
                      j+=1;
                      
                    }//end of if block where j will become 2 and never get executed after then

                    
                  });
                  //main Fetch end Here

      
        } //main if end here


        //nested if under foreach loop
        //checking where user has clicked
        //if it's and image or any other blank area
        //it will get executed
         if(post.id==post_id || post.id==img_class_no)
         {
              fetch('/user')
              .then(response => response.json())
              .then(emails=> {
                // Print emails
                var username=emails.user
                if(post.post_owner==username)
                {
                  document.querySelector("#edit-post-content").value='';
                  document.querySelector(".container").style.display='none';
                  document.querySelector("#feed").innerHTML='Edit Post';
                  document.querySelector(".edit-post").style.display='block';
                  document.querySelector("#edit-post-content").value=post.post_content;
                }
                }); //fetch user end
          
                document.querySelector("#submit").addEventListener('click',()=>{
                location.reload();
                var post_edited_content=document.querySelector("#edit-post-content").value;
                console.log(post_edited_content)
                document.querySelector(".container").style.display='block';
                document.querySelector(".edit-post").style.display='none';

                          var str=post.post_image;
                          var post_image=str.slice(7)

                          fetch(`/edit/${post.id}/`, {
                          method: 'PUT',
                          body: JSON.stringify({
                              id:post.id,
                              post_owner:post.post_owner,
                              post_image:post_image,
                              post_content:post_edited_content,
                              timestamp:post.timestamp
                                    })
                                  })
                            });// this is the end of submit button listener

          }//if block end


          //like button set-up start from here
          

            
        

            

            







          
        
      });//for each loop end
    });// add event listener end
}//this is the end of append post function



function newLikeFunction(like_button_id, post_id, s, post) {
  if (like_button_id == post_id && s == 1) {

    console.log("clicked");
    document.querySelector(`#${like_button_id}`).addEventListener('click', () => {
      console.log(like_button_id);
      if (post.liked) {

        fetch(`/like/${post.id}/`, {
          method: 'PUT',
          body: JSON.stringify({
            liked: false
          })
        });

        document.querySelector(`#${like_button_id}`).src = "/images/unliked.png";

      }
      else {
        fetch(`/like/${post.id}/`, {
          method: 'PUT',
          body: JSON.stringify({
            liked: true
          })
        });
        document.querySelector(`#${like_button_id}`).src = "/images/liked.png";

      }
    });

    s++;


  }
  return s;
}

function profilePostAdder(posts,post_owner_name){

    var mainContainer = document.querySelector(".main-container");
    for(var i=0;i<posts.length;i++)

      {
          var div = document.createElement("div");
          div.className="post-styling";
          div.id=posts[i].id;

          var post_image=document.createElement("img");
          var post_content=document.createElement("p");
          var post_time=document.createElement("p")

          post_image.id="post-image-profile";
          post_content.id="post-content-profile";
          post_time.id="post-time"

          div.appendChild(post_image);
          div.appendChild(post_content);
          div.appendChild(post_time);

          post_image.src=posts[i].post_image;
          post_content.innerHTML=posts[i].post_content;
          post_time.innerHTML=posts[i].timestamp;
          mainContainer.appendChild(div)
     }
}

function followUnfollow(loggedinuser,followers,post_owner_name)
{

  console.log(loggedinuser);
  console.log(followers);
  console.log(post_owner_name);

  var l=1;
  var m=1;
  


  document.querySelector("#follow-unfollow-button").addEventListener('click',()=>{



    console.log("button has been clicked");

    var follow_status=document.querySelector("#follow-unfollow-button").innerHTML;
    console.log(follow_status);




 if(follow_status=="follow")
 {

  console.log("run this function")


  fetch('/add', {
    method: 'POST',
    body: JSON.stringify({
      following: post_owner_name
     
    })
  });

  document.querySelector("#follow-unfollow-button").innerHTML="following";

  /////change following count///////
        l=1;//this logic has been done bcoz of not updating database before fetching it again
              //bcoz the data from this post request is not accurate
        fetch("/follower")
        .then(response => response.json())
        .then(followers=>{
        for(var k=0;k<followers.length;k++)
        {
          //using post-owner name, we can get to know,that we are calculating 
          //the followers and following for that specific user
          if(followers[k].following==post_owner_name)
          {

            l++;
           

          }
        }
        document.querySelector("#followers-count").innerHTML=l;
       

      });
  ////end following count ////////////////

  
 
  



 }
 else if(follow_status=="following")
 {


      console.log("runnning this function")


      fetch('/delete', {
        method: 'POST',
        body: JSON.stringify({
          following: post_owner_name
        
        })
      });

      document.querySelector("#follow-unfollow-button").innerHTML="follow";

       /////change following count///////

            m=-1;//this logic has been done bcoz of not updating database for fetching it again
            fetch("/follower")
            .then(response => response.json())
            .then(followers=>{
            for(var k=0;k<followers.length;k++)
            {
              //using post-owner name, we can get to know,that we are calculating 
              //the followers and following for that specific user
              if(followers[k].following==post_owner_name)
              {
                m++;

              }
            }
            document.querySelector("#followers-count").innerHTML=m;
            
            

          });
    ////end following count ////////////////

     
      
 }

 
   








  });//end of listener event


  // document.querySelector(".main-container").style.display='block';
  // document.querySelector(".container").style.display='none';





}









 
