import React from "react";
import './session.css'
import { NavLink } from "react-router-dom";

export function Login(){
    return (
        <main>
            <h2>Welcome back!</h2>
            <form>
                <input id = 'username' type = "text" name="varText" placeholder="Username" maxlength="20" required pattern="^[a-zA-Z0-9@!_]*"/>
                <input id = 'password' type = "password" name = "varPassword" placeholder="Password" required/>
                <div id = 'submit'>
                    <button type="submit">Login</button>
                    <NavLink id= 'reg' to = 'register'>Not registered? Click here!</NavLink>
                </div>
            </form>
        </main>
    )
}