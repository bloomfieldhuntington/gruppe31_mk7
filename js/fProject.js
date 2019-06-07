// Code for adding users to cards

var note = document.getElementsByClassName("card-project");

var users = document.getElementsByClassName("users");


for (var i=0; i<users.length; i++) {
    console.log(users);
    users[i].setAttribute("draggable", true);
}






