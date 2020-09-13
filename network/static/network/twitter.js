document.addEventListener('DOMContentLoaded', function() {

    load_posts()

   

    // Use buttons to toggle between views
    



  });





function load_posts(){



  document.querySelector(".edit-post").style.display='none';


    fetch('/posts')
    .then(response => response.json())
    .then(function(posts){

    

      appendPosts(posts);
       
 ;
      
      


     

    });



}

function appendPosts(posts){
  
    var mainContainer = document.querySelector(".container");
    for(var i=0;i<posts.length;i++)
    {
        var div = document.createElement("div");
        div.className="post-styling";
        div.id=posts[i].id;
        var link=document.createElement("a");
        var post_owner=document.createElement("p");
        var post_image=document.createElement("img");
        var post_content=document.createElement("p");
        var post_time=document.createElement("p");
        post_owner.id="post-owner"
        post_image.id="post-image"
        post_content.id="post-content"
        post_time.id="post-time"
        link.appendChild(post_owner)
        div.appendChild(link);
        div.appendChild(post_image);
        div.appendChild(post_content);
        div.appendChild(post_time)
        link.href="profile/"+posts[i].post_owner
        post_owner.innerHTML=posts[i].post_owner
        post_image.src=posts[i].post_image
        post_content.innerHTML=posts[i].post_content
        post_time.innerHTML=posts[i].timestamp
     
        mainContainer.appendChild(div);
      





        
    
    }

    document.addEventListener('click',event=>{


      




     


      const post_id=event.target.id;
     
            
      posts.forEach(post=>{



        if(post.id==post_id){

          

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

                



          })







        }


           
    
    
        
    
    
    
    
       
        
    
         
          
    
    

    
    
        
      });
    });





}









 
