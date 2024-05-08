import React from "react";
import './session.css'
import { NavLink, useNavigate} from "react-router-dom";

export function Login({authenticate, updateUser}){
    const[error, errorMsg] = React.useState(undefined);
    const navigate = useNavigate();

    return(
        <main className="session">
            <h2>Welcome back!</h2>
            <form onSubmit={submit}>
                <input id = 'username' type = "text" name="varText" placeholder="Username" maxLength="20" required pattern="^[a-zA-Z0-9@!_]*"/>
                <input id = 'password' type = "password" name = "varPassword" placeholder="Password" required/>
                <ErrMsg error={error}/>
                <div id = 'submit'>
                    <button id = 'submit' type="submit">Login</button>
                    <NavLink id= 'reg' to = '../register'>Not registered? Click here!</NavLink>
                </div>
            </form>
        </main>
    )

    
    function submit(event){
        event.preventDefault();
        let user = {
            username: event.target.username.value,
            password: event.target.password.value
        }
        
        fetch('/api/session', {
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
        if (error == 401){
            return (
                <p className="error">Your username or password was incorrect.</p>
            )
        }
        else{
            return <p className="error">Something went wrong, please try again later.</p>
        }
    }
}