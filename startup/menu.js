if(new Date(localStorage.getItem("authorized")) < new Date()){
    localStorage.removeItem("authorized");
}

document.addEventListener("DOMContentLoaded", main());

function main(){
    //FIXME this needs to be a more robust check
    if (localStorage.getItem("authorized")!= null){
        //maybe a server call here
        document.querySelector('menu').remove();
        const menu = document.createElement('menu');
        menu.appendChild(listItem("index.html","Home"));
        men
        document.querySelector('nav').appendChild(menu);
    }
}

function listItem(href, name){
    let li = document.createElement('li');
    let a = document.createElement('a');
    li.setAttribute("class", "nav");
    a.setAttribute("class", "nav");
    a.setAttribute("href", href);
    a.textContent = name;
    li.appendChild(a);
    return li;
}