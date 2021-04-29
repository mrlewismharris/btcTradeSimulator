//quick function to get cookies
function getCookie(cname) {
  //set a temporary name (add "=")
  let name = cname + "=";
  //get the actual cookie string
  let decodedCookie = decodeURIComponent(document.cookie);
  //split the cookie string into an array @ the ';'
  let ca = decodedCookie.split(';');
  //loop through the exploded string
  for(let i = 0; i <ca.length; i++) {
    //variable with easier alias and to manipulate
    let c = ca[i];
    //loop+remove space(s) at beginning of string
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    //return part of the cookie if name matches the argument
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  //return nothing if name argument matches no cookies
  return "";
}

//quick function to set cookies
function setCookie(cname, cvalue, exdays) {
  //create new date variable with specific format for cookies
  let d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  //
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";SameSite=None;Secure;path=/";
}

const checkbox = document.getElementById('darkmodeCheckbox');

function darkmode() {
  let elements = document.getElementsByClassName("themed");
  for (element of elements) {
    element.classList.remove("light");
  }
}

function lightmode() {
  let elements = document.getElementsByClassName("themed");
  for (element of elements) {
    element.classList.add("light");
  }
}

if (getCookie("darkmode") == "true") {
  checkbox.checked = true;
  darkmode();
} else {
  checkbox.checked = false;
  lightmode();
}

checkbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    darkmode();
    setCookie("darkmode", "true", 180);
  } else {
    lightmode();
    setCookie("darkmode", "false", 180);
  }
})

function reloadDarkMode() {
  let elements = document.getElementsByClassName("themed");
  if (getCookie("darkmode") == "false") {
    for (element of elements) {
      element.classList.add("light");
    }
  } else {
    for (element of elements) {
      element.classList.remove("light");
    }
  }
}