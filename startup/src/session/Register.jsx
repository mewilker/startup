import React from "react";
import './session.css'
import { useNavigate } from "react-router-dom";

export function Register({updateUser, authenticate}){
    const[error, errorMsg] = React.useState(undefined);
    const navigate = useNavigate();

    return (
        <main className="session">
            <h2>Register!</h2>
            <form onSubmit={submit}>
                <input id = 'username' type = "text" name="varText" placeholder="Username*" maxLength="20" required pattern="^[a-zA-Z0-9@!_]*"/>
                <input id = 'password' type = "password" name = "varPassword" placeholder="Password*" required/>
                <input id = 'email' type = "text" placeholder="youremail@example.com" pattern="*@*"/>
            <ErrMsg error={error}/>
            <div id = 'submit'>
                <p>By clicking this button I allow Tourist Tycoon to store this data.</p>
            </div>
            <button type="submit">Sign me up!</button>
            </form>
        </main>
    )

    function submit(event){
        event.preventDefault();
        let user = {
            username: event.target.username.value,
            password: event.target.password.value,
            email: event.target.email.value
        }
        
        fetch('/api/user', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then((response) => {
            if (response.ok){
                updateUser(user.username);
                authenticate();
                navigate('/agency');
            }
            else{
                throw new Error(response.status);
            }
        }).catch((err) =>{
            errorMsg(err.message);
        })
    }
}
    
function ErrMsg({error}){
    if (error){
        if (error == 403){
            return (
                <p className="error">Please choose a different username.</p>
            )
        }
        else{
            return <p className="error">Something went wrong, please try again later.</p>
        }
    }
}