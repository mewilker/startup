function login(){
    let user = {
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value
    }

    fetch(window.location.origin + '/session', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then((response) => {
        response.json()
        if (response.status == 200){
            window.location.href= window.location.origin + '/agency'
        }
        else{
            throw new Error(response.status);
        }
    })
    .then((jsonResponse) => {
      console.log(jsonResponse);
    }).catch((err) =>{
        let errmsg = document.querySelector('p.error');
        let setme = false;
        let div = document.getElementById('submit');
        if (!errmsg){
            errmsg = document.createElement('p');
            errmsg.setAttribute('class', 'error');
            setme = true;
        }
        if (err.message == 401){
            errmsg.textContent = 'Your username or password was incorrect.'
        }
        else{
            errmsg.textContent = 'Something went wrong, please try again later.'
        }
        if (setme){
            div.prepend(errmsg);
        }
    });

}

function register(){
    let user = {
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value,
        email: document.querySelector("#email").value
    }

    fetch(window.location.origin + '/user', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then((response) => {
        response.json()
        if (response.status == 200){
            window.location.href= window.location.origin + '/agency'
        }
        else {
            throw new Error(response.status)
        }
    })
    .then((jsonResponse) => {
      console.log(jsonResponse);
    }).catch((err) =>{
        let errmsg = document.querySelector('p.error');
        let setme = false;
        let div = document.getElementById('submit');
        if (!errmsg){
            errmsg = document.createElement('p');
            errmsg.setAttribute('class', 'error');
            setme = true;
        }
        if (err.message == 403){
            errmsg.textContent = 'Please choose a different username.'
        }
        else{
            errmsg.textContent = 'Something went wrong, please try again later.'
        }
        if (setme){
            div.prepend(errmsg);
        }
    });
}

//TODO: give feedback when contacting the server