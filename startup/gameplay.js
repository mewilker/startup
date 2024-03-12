import { Travel } from "./agency.js";
import { Tycoon } from "./tycoon.js";

//read the tycoon from memory
let tycoon = localStorage.getItem("tycoon")
document.addEventListener("DOMContentLoaded", main());
//debugger;
function main (){
    //if no tycoon, create a new one and store it in memory
    if (tycoon == null){
        tycoon = new Tycoon(getUserCookie());
        //localStorage.setItem("tycoon",tycoon);
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
    console.log(tycoon);
    elem.textContent = tycoon.user();
    elem = document.getElementById("location");
    const agency = tycoon.currentAgency();
    elem.textContent = agency.place();
    elem = document.getElementById("money");
    elem.textContent = tycoon.money();
    
    clearUpgrade("hospitality");
    clearUpgrade("attraction");
    clearUpgrade("travel");

    loadUpgradePics();
}

function clearUpgrade(upgrade){
  let elem = document.querySelector("." + upgrade);
    for (let i = 0; i <= elem.querySelectorAll("." + upgrade).length; i++){
      let child = elem.querySelector("." + upgrade);
      console.log(child);
      child.remove();
    }
}

function loadUpgradePics(){
  const agency = tycoon.currentAgency();
  for (let i = 0; i < agency.travel.length; i++){
    let addme = document.createElement('img');
    let upgrade = agency.travel[i];
    addme.setAttribute("class", "travel");
    addme.setAttribute("src", upgrade.imgpath());
    addme.setAttribute("alt", upgrade.type());
    let elem = document.querySelector(".travel");
    elem.appendChild(addme);
  }
}