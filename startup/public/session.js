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
            //go to agency
        }
    })
    .then((jsonResponse) => {
      console.log(jsonResponse);
    });

    //TODO: error handling for
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
            //go to agency
        }
    })
    .then((jsonResponse) => {
      console.log(jsonResponse);
    });

    //TODO: error handling for 403
}
