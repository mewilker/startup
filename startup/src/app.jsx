import React from "react";
import './app.css';

export default function App(){
    return (
        <div className="body">
            <HomePageHeader />
            <main>The app goes here ideot.</main>
            <footer>
            <p id = 'copyright'>Created by Makenna Wilkerson</p>
            <a id = 'github' href="https://github.com/mewilker/startup">Github</a>
        </footer>
        </div>
    )
}

function HomePageHeader(){
    return (
        <header id = 'titlepage'>
            <h1 className = 'title'>Tourist Tycoon</h1>
            <nav>
                <menu>
                    <li className = 'nav'><a className = 'nav' href = 'index.html'>Home</a></li>
                    <li className = 'nav'><a className = 'nav' href = 'login.html'>Login</a></li>
                    <li className = 'nav'><a className = 'nav' href = 'register.html'>Register</a></li>
                    <li className = 'nav'><a className = 'nav' href = 'leaderboard.html'>Leaderboard</a></li>
                </menu>
            </nav>        
        </header>)
}