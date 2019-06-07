// darkmode.js

// Darkmode Dashboard
const body = document.getElementById("body");
const darkmodeIcon = document.getElementById("dark-mode-icon");
const cardsClass = document.getElementsByClassName("card-project");
const columnHeaderClass = document.getElementsByClassName("column-header");
const textUserClass = document.getElementsByClassName("textUser");

function styleClassBackgroundColor(htmlClass, color){
    for(let i=0;i<htmlClass.length;i++){
        htmlClass[i].style.backgroundColor = color;
    }
}

function styleClassTextColor(elementClass, color){
    for(let i=0;i<elementClass.length;i++){
        elementClass[i].style.color = color;
    }
}

//Creates a darkmode cookie if there is none
if (getCookie("darkmode") == ""){
    setCookie("darkmode", "0", 99);
}
var darkmode = getCookie("darkmode");

//Changes the site to darkmode upon loading if the darkmode cookie is "1"
if(darkmode == "1") {
        body.style.backgroundColor = "#444444";
        body.style.color = "#fff";
        darkmodeIcon.style.color = "#ffffff";
        setCookie("darkmode", "1", 99);
        darkmode = getCookie("darkmode");
        styleClassBackgroundColor(cardsClass, "#3a3a3a");
        styleClassTextColor(textUserClass, "#fff")
    } else {
        body.style.backgroundColor = "#ffffff";
        body.style.color = "#444444";
        darkmodeIcon.style.color = "#000000";
        setCookie("darkmode", "0", 99);
        darkmode = getCookie("darkmode");
        styleClassTextColor(textUserClass, "#333333")
    }

//Makes clicking on the darkmode icon switch the site between darkmode on/off
darkmodeIcon.addEventListener("click", () =>{
  if(darkmode == "0") {
        body.style.backgroundColor = "#444444";
        body.style.color = "#fff";
        darkmodeIcon.style.color = "#ffffff";
        setCookie("darkmode", "1", 99);
        darkmode = getCookie("darkmode");
        styleClassBackgroundColor(cardsClass, "#3a3a3a");
        styleClassBackgroundColor(columnHeaderClass, "#3a3a3a");
        styleClassTextColor(textUserClass, "#fff")
    } else {
        body.style.backgroundColor = "#ffffff";
        body.style.color = "#444444";
        darkmodeIcon.style.color = "#000000";
        setCookie("darkmode", "0", 99);
        darkmode = getCookie("darkmode");
        styleClassBackgroundColor(cardsClass, "#fff");
        styleClassBackgroundColor(columnHeaderClass, "#fff");
        styleClassTextColor(textUserClass, "#333333")
    }
})
