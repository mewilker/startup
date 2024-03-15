import { getUserCookie, renderMoney } from "./gameplay.js";
import { Tycoon } from "./tycoon.js";

const canvas = document.getElementById("world");
const ctx = canvas.getContext('2d');
const img = new Image();
img.onload = () => {
    ctx.drawImage(img,0,0, canvas.width, canvas.height);
};
img.src = "assets/world.jpg"

let tycoon = JSON.parse(localStorage.getItem("Tycoon"));
document.addEventListener("DOMContentLoaded", main());

function main(){
    tycoon = new Tycoon(getUserCookie(), tycoon);
    renderMoney();

}

function parseLocations(){
    
}