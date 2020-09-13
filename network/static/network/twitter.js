document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.getElementById("follow-unfollow-button").addEventListener('click',()=>{



        fetch('users/')
        .then(response => response.json())
        .then(email => {
            // Print email
            console.log(email);
        
            // ... do something else with email ...
        });

       
        

    });



  });