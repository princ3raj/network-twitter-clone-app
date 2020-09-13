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
        post_owner.id="post-owner"
        post_image.id="post-image"
        post_image.className=posts[i].id
        post_content.id="post-content"
        post_time.id="post-time"
        // link.appendChild(post_image);
        // div.appendChild(link);
        div.appendChild(post_owner);
        div.appendChild(post_image);
        div.appendChild(post_content);
        div.appendChild(post_time);
        
        // link.href="profile/"+posts[i].post_owner
        post_owner.innerHTML=posts[i].post_owner
        post_image.src=posts[i].post_image
        post_content.innerHTML=posts[i].post_content
        post_time.innerHTML=posts[i].timestamp
     
        mainContainer.appendChild(div);
        console.log(div)
      





        
    
    }




    document.addEventListener('click',event=>{



      const post_id=event.target.id;
      const img_class_no=event.target.className;
      const post_owner_name=event.target.innerHTML;
      console.log(post_owner_name);
      var j=1;
     
            
        posts.forEach(post=>{



               


                if(post.post_owner==post_owner_name){


                  document.querySelector(".container").style.display='none';
              
                  fetch(`/profile/${post_owner_name}/`)
                  .then(response => response.json())
                  .then(function(posts){


                    document.querySelector(".main-container").style.display='block';

                    //this logic helps that function to run for only one one time
                    if(j==1)
                    {
                      document.querySelector("#username").innerHTML=post_owner_name;
                      document.querySelector("#posts-count").innerHTML=posts.length;


                    ///////////////// for followers and following count\\\\\\\\\\\\\\\\\\



                              fetch("/follower")
                              .then(response => response.json())
                              .then(followers=>{


                                l=0;
                                m=0;
                                n=0;

                                fetch('/user')
                                .then(response => response.json())
                                .then(username=> {


                                  var loggedinuser=username.user

                                 

                                  for(var z=0;z<followers.length;z++)

                                  {


                                    if(followers[z].following==post_owner_name && followers[z].follower==loggedinuser)
                                    {
  
                                      n+=1
  
  
                                      document.querySelector("#follow-unfollow-button").innerHTML="following";
  
                                      console.log(n)
  
  
  
  
  
                                    }






                                  }

                           


                               

                                });


                                for(var k=0;k<followers.length;k++)
                                {

                                  if(followers[k].follower==post_owner_name)
                                  {
                                    l+=1;

                                  }

                                  if(followers[k].following==post_owner_name)
                                  {
                                    m+=1;

                                  }

                                 


                                }

                                /////////which user is logged in so we can hide the follow button\\\\\\\\


                                fetch('/user')
                                .then(response => response.json())
                                .then(username=> {


                                  var loggedinuser=username.user

                                  if(loggedinuser==post_owner_name)
                                  {
                                    document.querySelector("#follow-unfollow-button").style.display='none';
                                  }







                                });



                                /////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



                                document.querySelector("#followers-count").innerHTML=l;
                                document.querySelector("#following-count").innerHTML=m;


                              
                                

                                  

                              });








                      
                    //////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                      
                      profilePostAdder(posts,post_owner_name); 
                      j+=1;



                    }
                    j+=1;
                    

                      

                  });

        
          






        }


 
         if(post.id==post_id || post.id==img_class_no)
         {


      

          

              fetch('/user')
              .then(response => response.json())
              .then(emails=> {
                // Print emails
                var username=emails.user

                console.log(username)
                console.log(post.post_owner)


                if(post.post_owner==username)
                {
                  document.querySelector("#edit-post-content").value='';
                  document.querySelector(".container").style.display='none';
                  document.querySelector(".edit-post").style.display='block';
                  document.querySelector("#edit-post-content").value=post.post_content;
                }
                
              
            
                }); 

         


         
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

                                  



                            });

                      }
        
      });
    });





}








function profilePostAdder(posts,post_owner_name){

  var mainContainer = document.querySelector(".main-container");
  





  for(var i=0;i<posts.length;i++)

  {

        console.log(posts.length)

        var div = document.createElement("div");
        div.className="post-styling";
        div.id=posts[i].id;

        
    
        var post_image=document.createElement("img");
        var post_content=document.createElement("p");

       
        post_image.id="post-image-profile";
        post_content.id="post-content-profile";

       
        div.appendChild(post_image);
        div.appendChild(post_content);

        post_image.src=posts[i].post_image;
        post_content.innerHTML=posts[i].post_content;


        mainContainer.appendChild(div)



  }



  

  


  








}









 
