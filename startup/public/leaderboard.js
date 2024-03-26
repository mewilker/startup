let list = document.querySelectorAll("tr");

let rank = 1;

for (let i = 0; i < list.length; i++){
  if (list[i].id != "headers"){
    list[i].remove();
  }
}

const res = await fetch('/scores')
const json = await res.json();
json.forEach(element => {
  appendRow(element.user, element.money);
});

function appendRow(user, money){
    let row = document.createElement("tr")
    let col = document.createElement("td");
    col.setAttribute('class', 'rank');
    col.textContent = rank++;
    row.appendChild(col);
    col = document.createElement('td');
    col.setAttribute('class', 'user');
    col.textContent = user;
    row.appendChild(col);
    col = document.createElement('td');
    col.setAttribute('class', 'score');
    const tycoon = JSON.parse(localStorage.getItem("tycoon"));
    col.textContent = `$${money}`;
    row.appendChild(col);

    document.querySelector('table').appendChild(row);
}