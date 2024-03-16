import { getUserCookie, renderMoney } from "./gameplay.js";
import { Tycoon } from "./tycoon.js";

const canvas = document.getElementById("world");
const ctx = canvas.getContext('2d');
const img = new Image();
img.onload = () => {
    ctx.drawImage(img,0,0, canvas.width, canvas.height);
};
img.src = "assets/world.jpg";

let tycoon = JSON.parse(localStorage.getItem("tycoon"));
let locations = [];
document.addEventListener("DOMContentLoaded", main());

function main(){
    tycoon = new Tycoon(getUserCookie(), tycoon);
    renderMoney();
    locations = tycoon.getPurchasedLocations().concat(tycoon.getPossibleLocations());
    placePins();
}

function placePins(){
    const lightpin = new Image();
    lightpin.onload = () => {
        ctx.drawImage (lightpin, 48, 53, lightpin.width/40, lightpin.height/40);
    }

    lightpin.src = "assets/lightpin.png";
}