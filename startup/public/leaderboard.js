import { getUserCookie } from "./gameplay.js";

let list = document.querySelectorAll("tr");
for (let i = 0; i < list.length; i++){
  if (list[i].id != "headers"){
    list[i].remove();
  }
}

appendRow();

function appendRow(){
    let row = document.createElement("tr")
    let col = document.createElement("td");
    col.setAttribute('class', 'rank');
    col.textContent = "1";
    row.appendChild(col);
    col = document.createElement('td');
    col.setAttribute('class', 'user');
    col.textContent = getUserCookie();
    row.appendChild(col);
    col = document.createElement('td');
    col.setAttribute('class', 'score');
    const tycoon = JSON.parse(localStorage.getItem("tycoon"));
    col.textContent = `$${tycoon.money}`;
    row.appendChild(col);

    document.querySelector('table').appendChild(row);
}