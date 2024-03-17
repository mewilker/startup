import { getUserCookie, renderMoney, saveTycoon } from "./gameplay.js";
import { Tycoon } from "./tycoon.js";

let tycoon = JSON.parse(localStorage.getItem("tycoon"));
let locations = [];
document.addEventListener("DOMContentLoaded", main);

function main(){
    tycoon = new Tycoon(getUserCookie(), tycoon);
    renderMoney();
    locations = tycoon.getPurchasedLocations().concat(tycoon.getPossibleLocations());
    var map = L.map('map').setView([36.0544, -112.1401], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    tycoon.getPurchasedLocations().forEach(location => {
        var marker = makeMovePin(location);
        marker.addTo(map);
    });
    tycoon.getPossibleLocations().forEach(location => {
        var marker = makeBuyPin(location);
        marker.addTo(map);
    });
    document.querySelector('button.confirm').remove();
}

function makeMovePin(location){
    var marker =  L.marker(location.coordinates());
    marker.on('click', function (){
        askMoveAgency(location);
    });
    return marker;
}

function makeBuyPin(location){
    var marker = L.marker(location.coordinates());
    marker.on('click', function(){
        askBuyAgency(location);
    });
    return marker;
}

function askMoveAgency(location){
    let elem = document.querySelector('button.confirm');
    if (elem != null){
        elem.remove();
    }
    if (location.name() != tycoon.currentAgency().location.name()){
        document.querySelector('p.confirm').textContent = `Move to ${location.name()}?`
        elem = document.querySelector('div.confirm');
        let button = document.createElement('button');
        button.setAttribute('class', 'confirm');
        button.textContent = "Let's go!";
        button.addEventListener('click', function(){
            moveAgency(location);
        })
        elem.appendChild(button);
    }
    else{
        document.querySelector('p.confirm').textContent = `Your agency is at ${location.name()}!`
    }

}

function askBuyAgency(location){
    document.querySelector('p.confirm').textContent = `Expand to ${location.name()} for $${location.price()}?`
    let elem = document.querySelector('button.confirm');
    if (elem != null){
        elem.remove();
    }
    elem = document.querySelector('div.confirm');
    let button = document.createElement('button');
    button.setAttribute('class', 'confirm');
    button.textContent = "Expand!";
    button.addEventListener('click', function(){
        buyAgency(location);
    })
    elem.appendChild(button);
}

function moveAgency(location){
    try{
        tycoon.moveLocation(location.name());
        saveTycoon(tycoon.tojson());
    } catch (error){
        console.log(error);
    }
    window.location.href = "agency.html";
}

async function buyAgency(location){
    try{
        tycoon.buyLocation(location);
        await saveTycoon(tycoon.tojson());
        window.location.href = "agency.html";
    }
    catch (error){
        if (error.message == "Not enough money!"){
            document.querySelector('p.confirm').textContent = error.message;
        }
        else{
            console.log(error);
        }
    }
}

window.addEventListener('beforeunload', function(){saveTycoon(tycoon.tojson())});