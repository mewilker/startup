import { getUserCookie, renderMoney } from "./gameplay.js";
import { Tycoon } from "./tycoon.js";

let tycoon = JSON.parse(localStorage.getItem("tycoon"));
let locations = [];
document.addEventListener("DOMContentLoaded", main());

function main(){
    tycoon = new Tycoon(getUserCookie(), tycoon);
    renderMoney();
    locations = tycoon.getPurchasedLocations().concat(tycoon.getPossibleLocations());
    var map = L.map('map').setView([36.0544, -112.1401], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

function placePins(){
    const lightpin = new Image();
    lightpin.onload = () => {
        ctx.drawImage (lightpin, 48, 53, lightpin.width/40, lightpin.height/40);
    }

    lightpin.src = "assets/lightpin.png";
}