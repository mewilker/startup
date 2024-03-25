if(new Date(localStorage.getItem("authorized")) < new Date()){
    localStorage.removeItem("authorized");
}

document.addEventListener("DOMContentLoaded", main());

function main(){
    fetch('/session').then((res)=>{
        if (res.ok){
            document.querySelector('menu').remove();
            const menu = document.createElement('menu');
            menu.appendChild(listItem("index.html","Home"));
            menu.appendChild(listItem("/agency", "Your Agency"));
            menu.appendChild(listItem("locations.html","Locations"));
            menu.appendChild(listItem("leaderboard.html","Leaderboard"));
            menu.appendChild(listItem("index.html", "Logout"));
            document.querySelector('nav').appendChild(menu);
        }
    }).catch((err)=> console.log(err))

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
    fetch('/session',{method:'DELETE'}).then((res)=>{
        if(res.ok){
            window.location.href = window.location.origin;
        }
    })
}