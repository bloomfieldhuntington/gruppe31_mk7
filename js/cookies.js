//Will find a cookie based on name input and return only the value of the cookie
function getCookie(cName) {
  let name = cName + "=";
  let cArray = document.cookie.split(';');
  for(var i = 0; i < cArray.length; i++) {
    let c = cArray[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//Let's you make/update a cookie by entering the name, value and time to expire in years
function setCookie(cname, cvalue, exyears) {
  let d = new Date();
  d.setTime(d.getTime() + (exyears * 365 * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}