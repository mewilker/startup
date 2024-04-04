import { Attraction, Hospitality, Travel } from "./agency.mjs";
import Tycoon from "./tycoon.mjs";
import { logout } from "./menu.js";

const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`)
let clicks = 0;
socket.onopen = (event) => {
  console.log('connected to websocket')
}

socket.onclose = (event) =>{
  console.log('disconnected from websocket')
}

socket.onmessage = async (event) => {
  const wsmsg = JSON.parse(event.data);
  if (wsmsg.type == 'location'){
    addMessage(wsmsg.message);
  }
  else if (wsmsg.type == 'error'){
    addErrorMessage(wsmsg.message);
  }
};

let tycoon = null;
try{
  document.addEventListener("DOMContentLoaded", main);
} catch(error){
  console.log(error);
}
document.getElementById('logout')
  .addEventListener('click', function(){logout()});
let list = document.querySelectorAll("a");
for (let i = 0; i < list.length; i++){
  list[i].addEventListener('click', function() {localStorage.setItem("tycoon", tycoon.tojson());})
}

async function main (){
    //if no tycoon, create a new one and store it in memory
  if (tycoon == null || tycoon == 'undefined'){
    fetch('/tycoon').then((response) => {
      if (!response.ok){
        window.location.href = '/login'
      }
      response.json().then( async (json)=>{
        tycoon = new Tycoon(await getUser(), json);
        await renderTycoon();
        loadUpgradeButtons();
        document.querySelector("button.basic").addEventListener('click', 
          function(){
            clicks++;
            tycoon.bookTours();
            renderMoney(tycoon.money());
        });
        localStorage.setItem('tycoon', tycoon.tojson())
      })
    }).catch((err)=>{
      addMessage(err.message);
    })
  }
  else{
    saveTycoon(tycoon.tojson());
    //TODO make sure the database is current
  }
}

export async function getUser () {
  try{
    const res = await fetch('/session')
    if (!res.ok){
      window.location.href = '/login'
    }
    const json = await res.json();
    return json.user;
  }
  catch(err){
    addMessage(err.message);
  }
}

async function renderTycoon(){
  let elem = document.getElementById("user");
  elem.textContent = tycoon.user();
  elem = document.getElementById("location");
  const agency = tycoon.currentAgency();
  elem.textContent = agency.place();
  elem = document.querySelector('main');
  renderMoney(tycoon.money());    
  clearUpgrade("hospitality");
  loadUpgradePics("hospitality");
  clearUpgrade("attraction");
  loadUpgradePics("attraction");
  clearUpgrade("travel");
  loadUpgradePics("travel");
  clearMessages();
  const id = tycoon.currentAgency().location.picsumid();
  try{
    fetch('https://picsum.photos/id/'+id + '/'+ elem.offsetWidth+'/'+elem.offsetHeight).then((res)=>{
      if (res.ok){
        elem.style.backgroundImage= `url('${res.url}')`;
      }
    })
    fetch('https://picsum.photos/id/'+id+'/info').then((res)=>{
      res.json().then((json)=>{
        let elem = document.getElementById('copyright')
        elem.textContent = elem.textContent + ` Photo by ${json.author}`
      })
    })
  }
  catch(err){
    console.log(err);
  }
}

export function renderMoney(money){
  let elem = document.getElementById("money");
  elem.textContent = money;
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

async function loadUpgradeButtons(){
  const agency = tycoon.currentAgency();
  clearUpgrade("hospitality");
  loadUpgradePics("hospitality");
  clearUpgrade("attraction");
  loadUpgradePics("attraction");
  clearUpgrade("travel");
  loadUpgradePics("travel");

  const res = await fetch('/available');
  const json = await res.json();
  json.forEach(upgrade => {
    if (upgrade.type == 'location'){
      if (upgrade.notified == undefined){
        let msg = "A new location is available in " + upgrade.name + "! Check out the locations tab!"
        addMessage(msg);
        agency.addAvailableLocation(upgrade.name);
        saveTycoon(tycoon.tojson());
      }
      else{
        let msg = "A new location is available in " + upgrade.name + "!"
        addMessage(msg);
      }
    }
    else{
      createUpgradeButton(upgrade.name, upgrade.type, upgrade.price, upgrade.clickgain);
    }
  });
}
  
function createUpgradeButton(name, type, price, clickgain){
  let upgrade = undefined;
  let button = document.createElement('button');
  switch(type){
    case "travel":
      upgrade = new Travel(name,price,clickgain);
      button.addEventListener('click', function(){
        sendClicks();
        addTravel(upgrade)
      });
      break;
    case "hospitality":
      upgrade = new Hospitality(name, price, clickgain);
      button.addEventListener('click',function(){
        sendClicks();
        addHopsitality(upgrade)
      });
      break;
    case "attraction":
      upgrade = new Attraction(name, price,  clickgain);
      button.addEventListener('click', function(){
        sendClicks();
        addAttraction(upgrade)
      });
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

async function addTravel(upgrade){
    const agency= tycoon.currentAgency();
    try {
      tycoon.buy(upgrade.price());
      const tosend = {name: upgrade.type(), type: 'travel', price: upgrade.price(), clickgain: upgrade.clickgain()}
      fetch('/upgrade', {
        method:'PUT',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(tosend)
      }).then((res)=>{
        clearUpgrade("travel");
        loadUpgradePics("travel");
        loadUpgradeButtons();
      })
      agency.travel.push(upgrade);
      tycoon.calculateGain();
      renderMoney(tycoon.money());
    } catch (error){
      if (error.message == "Not enough money!"){
        addErrorMessage(error.message)
      }
      else {
        console.log(error);
      }
    }
}

async function addHopsitality(upgrade){
  const agency= tycoon.currentAgency();
  //subtract money from tycoon
  try {
    tycoon.buy(upgrade.price());
    const tosend = {name: upgrade.type(), type: 'hospitality', price: upgrade.price(), clickgain: upgrade.clickgain()}
    await fetch('/upgrade', {
      method:'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(tosend)
    })
    agency.hospitality.push(upgrade);
    tycoon.calculateGain();
    renderMoney(tycoon.money());
    clearUpgrade("hospitality");
    loadUpgradePics("hospitality");
    loadUpgradeButtons();
  } catch (error){
    if (error.message == "Not enough money!"){
      addErrorMessage(error.message)
    }
    else {
      console.log(error);
    }
  }
}

async function addAttraction(upgrade){
  const agency= tycoon.currentAgency();
  try {
    tycoon.buy(upgrade.price());
    const tosend = {name: upgrade.type(), type: 'attraction', price: upgrade.price(), clickgain: upgrade.clickgain()}
    fetch('/upgrade', {
      method:'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(tosend)
    }).then((res)=>{
      clearUpgrade("attraction");
      loadUpgradePics("attraction");
      loadUpgradeButtons();
    })
    agency.attractions.push(upgrade);
    tycoon.calculateGain();
    renderMoney(tycoon.money());

  } catch (error){
    if (error.message == "Not enough money!"){
      addErrorMessage(error.message);
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

function addErrorMessage(message){
  let list = document.querySelector('ul.wsmsg');
  let addme = document.createElement('li');
  addme.setAttribute("class", "error");
  addme.textContent = message;
  list.appendChild(addme);
}

export async function saveTycoon(json){
  localStorage.setItem("tycoon", json);
  const res = await fetch('/tycoon', {
    method: 'PUT',
    body: json,
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
}

setInterval(()=>{
  sendClicks()
}, 10000)

function sendClicks(){
  try{
    socket.send(`{"type":"clicks", "clicks":${clicks}}`)
    clicks = 0;
  }
  catch(err){
    addErrorMessage("Problem! Money was not saved!")
  }
}

window.addEventListener('beforeunload', async function(){/*TODO: save moneys before leaving*/});