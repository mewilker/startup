import React from "react";
import './gameplay.css';
import Tycoon from "../../service/public/tycoon.mjs";

export function Agency({user}){
    let tycoon = undefined;
    const [location, changeLocation] = React.useState(null);
    const [imgurl, changeurl] = React.useState(null);
    const [author, changeauthor] = React.useState(null);
    
    React.useEffect(()=>{
        fetch('/api/tycoon').then((response)=>{
            if (!response.ok){
                //go to login
            }
            response.json().then((json)=>{
                tycoon = new Tycoon({user},json)
                localStorage.setItem('tycoon', tycoon.tojson())
                const agency = tycoon.currentAgency();
                changeLocation(agency.place());
                const id = agency.location.picsumid()
                try{
                    fetch('https://picsum.photos/id/'+id + '/300/300').then((res)=>{
                        if (res.ok){
                            changeurl(`url('${res.url}')`)
                        }
                    })
                    fetch('https://picsum.photos/id/'+id+'/info').then((res)=>{
                        res.json().then((json)=>{
                            changeauthor(json.author)
                        })
                    })
                }
                catch(err){
                    console.log(err)
                }
            })
        })
    },[])

    return(
        <main className="agency" style={{backgroundImage:{imgurl}}}>
            <div className="agencyhead">
                <h2 id = 'agencytitle'>Welcome to <span id = "user">{user}</span>'s agency in <span id = 'location'>{location}</span>!</h2>
            </div>
            <div className="agencybod">
                <div className="wsmsg">
                    <ul className="wsmsg">
                        Websocket goes here
                    </ul>
                </div>
            <div className="ui">
                <Money tycoon={tycoon}/>
                <div className="hospitality"></div>
                <div className="attraction"></div>
                <div className="travel"></div>
            </div>
            </div>
        </main>
    )
}

function Message({message}){
    return <li className="wsmsg">{message}</li>
}

function ErrorMessage({message}){
    return <li className="error">{message}</li>
}

function Money(){
    const [amount, changeAmount] = React.useState(0.01)
    const [clicks, changeclicks] = React.useState(0)
    
    React.useEffect(()=>{
        const json = localStorage.getItem('tycoon')
        let tycoon = new Tycoon('user', JSON.parse(json));
        if (clicks > 0){
            tycoon.bookTours()
        }
        changeAmount(tycoon.money())
        localStorage.setItem('tycoon', tycoon.tojson())
    },[clicks])

    function BookTours(){
        changeclicks(clicks+1)
    }

    setInterval(()=>{
        //sendClicks()
    },10000)

    return (
        <div className="basic">
            <h3 className="basic">$<span id = 'money'>{amount.toFixed(2)}</span></h3>
            <button className="basic" onClick={BookTours}>Book Tours</button>
        </div>
    )
}

function UpgradePic({type}){
    
}

function UpgradeButton({name, type, price, clickgain}){
    return <button className={type}>Buy {name} ${price}</button>
}

function Travel(){

}

function Hospitality(){

}

function Attraction(){

}