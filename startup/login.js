function login(){
    //TODO: post http method

    const username = document.querySelector("#username");
    const password = document.querySelector("#password");
    document.cookie = `username = ${username.value}`;
    document.cookie = `authToken = abc`; //TODO: get a ssid from the server
    window.location.href = "agency.html";
}

const form = document.querySelector('form');
form.addEventListener("submit", login);