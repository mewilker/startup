function login(){
    //TODO: post http method

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    setAuth(username);

    window.location.href = "agency.html";
}

function register(){
    //TODO: post http method

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const email = document.querySelector("#email").value;

    setAuth(username);

    window.location.href = "agency.html";
}


function setAuth(username){
    const d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));

    //http only cookies wouldn't allow this kind of code. 
    //however that is the best defense against xss
    document.cookie = `username = ${username}; expires= ${d.toUTCString()}`;
    document.cookie = `authToken = abc; expires= ${d.toUTCString()}`;

    //TODO: CSRF TOKENS

    //if the date is valid, the browser can know that the user is authorized
    //this saves the date in local storage
    //it would be better encrypted
    localStorage.setItem("authorized", d);
}
