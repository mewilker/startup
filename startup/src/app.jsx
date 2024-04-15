import React from "react";
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, redirectDocument } from 'react-router-dom';
import { Login } from "./session/Login";
import { Register } from "./session/Register";
import { Leaderboard } from "./leaderboard/Leaderboard";


export default function App(){
    const [isAuthenticated, setAuthState] = React.useState(false)
    const [username, changeUser] = React.useState(undefined)


    React.useEffect(()=>{
        fetch('/api/session').then((res)=>res.json())
        .then((jres)=>{
            if (jres.user==undefined){
                setAuthState(false);
            }
            else{
                changeUser(jres.user);
                setAuthState(true);
            }
        }).catch((err)=>{
            setAuthState(false);
            console.log(err);
        })
    },[isAuthenticated]);

    return (
        <BrowserRouter>
            <div className="body">
                <Routes>
                    <Route exact path='/' element={<HomePageHeader isAuthenticated={isAuthenticated}/>} />
                    <Route path = '*' element={<MinimizedHeader isAuthenticated={isAuthenticated}/>} />
                </Routes>
                <Routes>
                    <Route exact path='/' element={<HomPageMain />} />
                    <Route path='/login' element={<Login authenticate={()=>{
                        setAuthState(true);
                    }} updateUser={(username)=>{
                        changeUser(username)
                    }}/>} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/leaderboard' element={<Leaderboard />} />
                    <Route path='*' element = {<NotFound />} />
                </Routes>
                <footer>
                <p id = 'copyright'>Created by Makenna Wilkerson</p>
                <a id = 'github' href="https://github.com/mewilker/startup">Github</a>
            </footer>
        </div>
        </BrowserRouter>
    )
}

function HomePageHeader({isAuthenticated}){
    if(isAuthenticated){
        return (
            <header id = 'titlepage'>
                <h1 className = 'title' id="home">Tourist Tycoon</h1>
                <nav className="home">
                    <AuthedNavHome />
                </nav>
            </header>
        )
    }
    return (
        <header id = 'titlepage'>
            <h1 className = 'title' id="home">Tourist Tycoon</h1>
            <nav className="home">
                <UnAuthedNavHome />
            </nav>        
        </header>)
}

function MinimizedHeader({isAuthenticated}){
    if (isAuthenticated){
        return(
            <header>
                <h1 className = 'title'>Tourist Tycoon</h1>
                <nav>
                    <AuthedNav />
            </nav>
            </header>  
        )
    }
    
    return(
        <header>
            <h1 className = 'title'>Tourist Tycoon</h1>
            <nav>
                <UnAuthedNav />
            </nav>
        </header>
    )
}

function UnAuthedNav(){
    return(
        <menu>
            <li><NavLink className = 'nav' to = ''>Home</NavLink></li>
            <li><NavLink className = 'nav' to = 'login'>Login</NavLink></li>
            <li><NavLink className = 'nav' to = 'register'>Register</NavLink></li>
            <li><NavLink className = 'nav' to = 'leaderboard'>Leaderboard</NavLink></li>
        </menu>
    )
}

function UnAuthedNavHome(){
    return(
        <menu className="home">
            <li className="home"><NavLink className = 'navhome' to = ''>Home</NavLink></li>
            <li className="home"><NavLink className = 'navhome' to = 'login'>Login</NavLink></li>
            <li className="home"><NavLink className = 'navhome' to = 'register'>Register</NavLink></li>
            <li className="home"><NavLink className = 'navhome' to = 'leaderboard'>Leaderboard</NavLink></li>
        </menu>
    )
}

function AuthedNav(){
    return(
        <menu>
            <li><NavLink className = 'nav' to = ''>Home</NavLink></li>
            <li><NavLink className = 'nav' to = 'agency'>Your Agency</NavLink></li>
            <li><NavLink className = 'nav' to = 'locations'>Locations</NavLink></li>
            <li><NavLink className = 'nav' to = 'leaderboard'>Leaderboard</NavLink></li>
            <li><NavLink className = 'nav' to = 'login'>Logout</NavLink></li>
        </menu>
    )
}

function AuthedNavHome(){
    return(
        <menu className="home">
            <li className="home"><NavLink className = 'navhome' to = ''>Home</NavLink></li>
            <li className="home"><NavLink className='navhome' to='agency'>Your Agency</NavLink></li>
            <li className="home"><NavLink className = 'navhome' to = 'locations'>Locations</NavLink></li>
            <li className="home"><NavLink className = 'navhome' to = 'leaderboard'>Leaderboard</NavLink></li>
            <li className="home"><NavLink className = 'navhome' to = 'login'>Logout</NavLink></li>

        </menu>
    )
}

function HomPageMain(){
    return(
        <main className="home">
            <section className = 'news' id = 'news'>
                <h2 className = 'news' id = 'newstitle'>News</h2>
                <p className = 'news'> Tourist Tycoon is currently under developement at version 0.1.5! What's new? Alerts when your friends buy new locations. Coming up, even more new locations! Future updates will feature custom upgrade icons, a map overhaul, and some ambient music.</p>
            </section>
            <section>
                <h2>Welcome!</h2>
                <p>Tourist Tycoon is a clicker style game where you arrange the hospitality, travel and entertainment for guests who buy your vacation package! Start your own travel agency and work your way up to colonize the world... at least in terms of travel. Invite your friends to play and see who can become the biggest Tourist Tycoon!</p>
                <p> You can preview the gameplay by registering for an account! Please note that this a student project. Currently you can play up to the British Virgin Isles. Big shoutout to Leaflet and OpenStreetMap for the map element in the game!</p>
            </section></main>
    )
}

function NotFound(){
    return(
        <main>
            <h2>Error 404: This page does not exist. How did you get here?</h2>
        </main>
    )
}