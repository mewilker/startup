import React from "react";
import './session.css'

export function Register(){
    return (
        <main>
            <h2>Register!</h2>
            <form>
                <input id = 'username' type = "text" name="varText" placeholder="Username*" maxLength="20" required pattern="^[a-zA-Z0-9@!_]*"/>
                <input id = 'password' type = "password" name = "varPassword" placeholder="Password*" required/>
                <input id = 'email' type = "text" placeholder="youremail@example.com" pattern="*@*"/>
            <div id = 'submit'>
                <p>By clicking this button I allow Tourist Tycoon to store this data.</p>
            </div>
            <button type="submit">Sign me up!</button>
            </form>
        </main>
    )
}