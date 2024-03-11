import { Tycoon } from "./tycoon.js";

//read the tycoon from memory
let tycoon = localStorage.getItem("tycoon")
document.addEventListener("DOMContentLoaded", main());
//debugger;
function main (){
    //if no tycoon, create a new one and store it in memory
    if (tycoon === null){
        tycoon = new Tycoon(getUserCookie());
        localStorage.setItem("tycoon",tycoon);
    }
    //TODO make sure the database is current
    //render the browser according to the database
    renderTycoon();
}

function getUserCookie () {
    let allCookies = decodeURIComponent(document.cookie);
    let cookieArray = allCookies.split(';');
    for(let i = 0; i <cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf("username=") == 0) {
        return cookie.substring("username=".length, cookie.length);
      }
    }
    return "";
}

function renderTycoon(){
    let elem = document.getElementById("user");
    debugger;
    elem.textContent(tycoon.user());

}
