import { Attraction, Hospitality, Travel } from "./agency.js";
import { Tycoon } from "./tycoon.js";
import { GrandCanyon } from "./csv.js";

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
    loadUpgradeButtons();
    document.querySelector("button.basic").addEventListener('click', 
      function(){
        tycoon.bookTours();
        renderMoney();
      });

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
    renderMoney();    
    clearUpgrade("hospitality");
    loadUpgradePics("hospitality");
    clearUpgrade("attraction");
    loadUpgradePics("attraction");
    clearUpgrade("travel");
    loadUpgradePics("travel");
}

function renderMoney(){
  let elem = document.getElementById("money");
  elem.textContent = tycoon.money();
}

function clearUpgrade(upgrade){
  let elem = document.querySelector("." + upgrade);
  for (let i = 0; i <= elem.querySelectorAll("." + upgrade).length; i++){
    let child = elem.querySelector("." + upgrade);
    if (child != null){
      child.remove();
    }
  }
}

function loadUpgradePics(upgradeType){
  const agency = tycoon.currentAgency();
  let upgradeList = undefined;
  switch (upgradeType) {
    case "hospitality":
      upgradeList = agency.hospitality;
      break;
    case "travel":
      upgradeList = agency.travel;
      break;
    case "attraction":
      upgradeList = agency.attractions;
      break;
    default:
      throw new Error("That's not an upgrade");
  }
  const selector = "." + upgradeType;
  for (let i = 0; i < upgradeList.length; i++){
    let addme = document.createElement('img');
    let upgrade = upgradeList[i];
    addme.setAttribute("class", upgradeType);
    addme.setAttribute("src", upgrade.imgpath());
    addme.setAttribute("alt", upgrade.type());
    let elem = document.querySelector(selector);
    elem.appendChild(addme);
  }
  
}

//TODO: parsing csv needs to be on the server side
function loadUpgradeButtons(){
  //figure out location
  let elem = document.getElementById("location");
  let csv = "";
  switch (elem.textContent) {
    case "the Grand Canyon":
      csv = GrandCanyon;
      break;
    default:
      throw "That's not a place you can expand!"
  }
  //grab lengths of upgrades
  const agency = tycoon.currentAgency();
  //match up to the csv
  const lines = GrandCanyon.split('\n');
  for (let lineIndex = 1; lineIndex < lines.length; lineIndex++){
    const line = lines[lineIndex];
    const values = line.split(",");
    if (values[1]==agency.travel.length 
      && values[2]==agency.hospitality.length
      && values [3]==agency.attractions.length){
        createUpgradeButton(values[0]);
      } 
    }
  }
  
  //FIXME the error handling is attrocious
  function createUpgradeButton(name){
  let upgrade = undefined;
  try {
    upgrade = new Travel(name,5,"plane-departure-solid.svg");
    let button = document.createElement('button');
    button.setAttribute("class", "travel");
    button.textContent = "Buy " + name + " $" + upgrade.price();
    button.addEventListener('click', function(){addTravel(upgrade)});
    let parent = document.querySelector(".travel");
    parent.appendChild(button);
  } catch (error) {
    try{
      upgrade = new Hospitality(name, 5,"hotel-solid.svg");
      let button = document.createElement('button');
      button.setAttribute("class", "hospitality");
      button.textContent = "Buy " + name + " $" + upgrade.price();
      button.addEventListener('click', function(){addHopsitality(upgrade)});
      let parent = document.querySelector(".hospitality");
      parent.appendChild(button);
    } catch (error){
      try{
        upgrade = new Attraction(name, 5, "binoculars-solid.svg");
        let button = document.createElement('button');
        button.setAttribute("class", "attraction");
        button.textContent = "Buy " + name + " $" + upgrade.price();
        let parent = document.querySelector(".attraction");
        parent.appendChild(button);
      }
      catch (error){
        console.log(`The upgrade "` + name + `" doesn't exist`);
      }
    }
  }

  function addTravel(upgrade){
    const agency= tycoon.currentAgency();
    //subtract money from tycoon
    try {
      tycoon.buy(upgrade.price());
      //add the upgrade to the agency
      agency.travel.push(upgrade);
      tycoon.calculateGain();
      renderMoney();
      clearUpgrade("travel");
      loadUpgradePics("travel");
      loadUpgradeButtons();
    } catch (error){
      //TODO: display not enough money to user
      console.log(error);
    }
  }

  function addHopsitality(){
    const agency= tycoon.currentAgency();
    //subtract money from tycoon
    try {
      tycoon.buy(upgrade.price());
      //add the upgrade to the agency
      agency.hospitality.push(upgrade);
      tycoon.calculateGain();
      renderMoney();
      clearUpgrade("hospitality");
      loadUpgradePics("hospitality");
      loadUpgradeButtons();
    } catch (error){
      //TODO: display not enough money to user
      console.log(error);
    }
  }

  function addAttraction(){

  }
}