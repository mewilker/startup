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
        menu.appendChild(listItem("agency.html", "Your Agency"));
        menu.appendChild(listItem("locations.html","Locations"));
        menu.appendChild(listItem("leaderboard.html","Leaderboard"));
        menu.appendChild(listItem("index.html", "Logout"));
        document.querySelector('nav').appendChild(menu);
    }
}

function listItem(href, name){
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute("class", "nav");
    a.setAttribute("href", href);
    a.textContent = name;
    if (name == "Logout"){
        a.addEventListener('click', function(){logout()});
        a.setAttribute('id','logout');
    }
    li.appendChild(a);
    return li;
}

export function logout(){
    const date = new Date();
    date.setTime(date.getTime() - (24*60*60*1000));
    localStorage.removeItem("authorized")
    document.cookie = "authToken=;expires=" + date.toUTCString + ";path=/startup";
    document.cookie = "username=;expires=" + date.toUTCString + ";path=/startup";
    const elem =document.getElementById('logout');
    elem.removeEventListener('click');
}