import { Attraction, Hospitality, Travel } from "./agency.js";
import { Tycoon } from "./tycoon.js";
import { GrandCanyon } from "./csv.js";
import { logout } from "./menu.js";

//read the tycoon from memory
let tycoon = localStorage.getItem("tycoon")
try{
  document.addEventListener("DOMContentLoaded", main());
} catch(error){
  console.log(error);
}
document.getElementById('logout')
  .addEventListener('click', function(){logout()});
let list = document.querySelectorAll("a");
for (let i = 0; i < list.length; i++){
  list[i].addEventListener('click', function() {saveTycoon()})
}
//debugger;
function main (){
    //if no tycoon, create a new one and store it in memory
    if (tycoon == null){
      tycoon = new Tycoon(getUserCookie());
      saveTycoon();
    }
    else{
      tycoon = new Tycoon(getUserCookie(), JSON.parse(tycoon));
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

export function getUserCookie () {
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
  clearMessages();
}

export function renderMoney(){
  let elem = document.getElementById("money");
  elem.textContent = tycoon.money();
}

function clearUpgrade(upgrade){
  let elem = document.querySelector("." + upgrade);
  let num = elem.querySelectorAll("." + upgrade).length;
  for (let i = 0; i <= num; i++){
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
  clearUpgrade("hospitality");
  loadUpgradePics("hospitality");
  clearUpgrade("attraction");
  loadUpgradePics("attraction");
  clearUpgrade("travel");
  loadUpgradePics("travel");
  //match up to the csv
  const lines = csv.split('\n');
  for (let lineIndex = 1; lineIndex < lines.length; lineIndex++){
    const line = lines[lineIndex];
    const values = line.split(",");
    const price = parseFloat(values[5])
    const clickgain = parseFloat(values[6]);
    switch(values[1]){
      case "travel":
        if (values[2]==agency.travel.length 
          && values[3]<=agency.hospitality.length
          && values [4]<=agency.attractions.length){
            createUpgradeButton(values[0],values[1],price, clickgain);
        }
        break;
      case "hospitality":
        if (values[2]<=agency.travel.length 
          && values[3]==agency.hospitality.length
          && values [4]<=agency.attractions.length){
            createUpgradeButton(values[0], values[1],price, clickgain);
        }
        break;
      case "attraction":
        if (values[2]<=agency.travel.length 
          && values[3]<=agency.hospitality.length
          && values [4]==agency.attractions.length){
            createUpgradeButton(values[0], values[1],price, clickgain);
        }
        break;
      case "location":
        if (values[2]==agency.travel.length 
          && values[3]==agency.hospitality.length
          && values [4]==agency.attractions.length){
            let bought = agency.findLocation(values[0]);
            if (bought == null){
              let msg = "A new location is available in " + values[0] + "! Check out the locations tab!"
              addMessage(msg);
              agency.addAvailableLocation(values[0]);
              saveTycoon();
            }
            else if (!bought){
              let msg = "A new location is available in " + values[0] + "!"
              addMessage(msg);
            }
          }
        break;
      default:
        throw new Error("Bad File");
      } 
    }
}
  
function createUpgradeButton(name, type, price, clickgain){
  let upgrade = undefined;
  let button = document.createElement('button');
  switch(type){
    case "travel":
      upgrade = new Travel(name,price,clickgain);
      button.addEventListener('click', function(){addTravel(upgrade)});
      break;
    case "hospitality":
      upgrade = new Hospitality(name, price, clickgain);
      button.addEventListener('click',function(){addHopsitality(upgrade)});
      break;
    case "attraction":
      upgrade = new Attraction(name, price,  clickgain);
      button.addEventListener('click', function(){addAttraction(upgrade)});
      if (name == "Exp"){
        const agency = tycoon.currentAgency();
        name = "the " + agency.specialAttraction() + " package";
      }
      break;
    default: 
      throw new Error ("Not a button");
  }
  button.setAttribute("class", type);
  button.textContent = "Buy " + name + " $" + upgrade.price();
  const selector = "." + type;
  let parent = document.querySelector(selector);
  parent.appendChild(button);
}

function addTravel(upgrade){
    const agency= tycoon.currentAgency();
    //subtract money from tycoon
    try {
      tycoon.buy(upgrade.price());
      //add the upgrade to the agency
      agency.travel.push(upgrade);
      tycoon.calculateGain();
      saveTycoon();
      renderMoney();
      clearUpgrade("travel");
      loadUpgradePics("travel");
      loadUpgradeButtons();
    } catch (error){
      if (error.message == "Not enough money!"){
        addMessage(error.message)
      }
      else {
        console.log(error);
      }
    }
}

function addHopsitality(upgrade){
  const agency= tycoon.currentAgency();
  //subtract money from tycoon
  try {
    tycoon.buy(upgrade.price());
    //add the upgrade to the agency
    agency.hospitality.push(upgrade);
    tycoon.calculateGain();
    saveTycoon();
    renderMoney();
    clearUpgrade("hospitality");
    loadUpgradePics("hospitality");
    loadUpgradeButtons();
  } catch (error){
    if (error.message == "Not enough money!"){
      addMessage(error.message)
    }
    else {
      console.log(error);
    }
  }
}

function addAttraction(upgrade){
  const agency= tycoon.currentAgency();
  //subtract money from tycoon
  try {
    tycoon.buy(upgrade.price());
    //add the upgrade to the agency
    agency.attractions.push(upgrade);
    tycoon.calculateGain();
    saveTycoon();
    renderMoney();
    clearUpgrade("attraction");
    loadUpgradePics("attraction");
    loadUpgradeButtons();
  } catch (error){
    if (error.message == "Not enough money!"){
      addMessage(error.message);
    }
    else {
      console.log(error);
    }
  }
}

function clearMessages(){
  let elem = document.querySelector('li.wsmsg');
  while (elem != null){
    elem.remove();
    elem = document.querySelector('li.wsmsg');
  }
}

function addMessage(message){
  let list = document.querySelector('ul.wsmsg');
  let addme = document.createElement('li');
  addme.setAttribute("class", "wsmsg");
  addme.textContent = message;
  list.appendChild(addme);
}

function saveTycoon(){
  localStorage.setItem("tycoon", tycoon.tojson());
}

window.addEventListener('beforeunload', function(){saveTycoon()});