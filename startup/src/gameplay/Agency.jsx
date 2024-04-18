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
                <ButtonHouse/>
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

function UpgradePic({type, upgrade}){
    return <img className={type} alt={upgrade.type()} src={upgrade.imgpath()}/>
}

function UpgradeButton({name, type, price, clickgain}){
    return <button className={type}>Buy {name} ${price}</button>
}

function Travel({upgrade}){

    const [purchased, setPurchased] = React.useState(Array(0))

    React.useEffect(()=>{
        const json = localStorage.getItem('tycoon')
        let tycoon = new Tycoon('user', JSON.parse(json));
        const agency = tycoon.currentAgency();
        setPurchased(agency.travel)
    },[upgrade])
    
    console.log(purchased);
    return (<div className="travel">
        {purchased.map((travel, index)=>(
            <UpgradePic type={'travel'} upgrade={travel} />
        ))}
        {upgrade && <UpgradeButton name={upgrade.name} type={'travel'} 
            price={upgrade.price} clickgain={upgrade.clickgain}/>}
    </div>)
}

function Hospitality({upgrade}){
    
    let purchased = Array(0);

    React.useEffect(()=>{
        const json = localStorage.getItem('tycoon')
        let tycoon = new Tycoon('user', JSON.parse(json));
        const agency = tycoon.currentAgency();
        purchased = agency.hospitality
    },[upgrade])

    return (<div className="hospitality">
        {purchased.map((hospitality)=>{
            <UpgradePic type={'hospitality'} upgrade={hospitality} />
        })}
        {upgrade && <UpgradeButton name={upgrade.name} type={'hospitality'} 
            price={upgrade.price} clickgain={upgrade.clickgain}/>}
    </div>)
}

function Attraction({upgrade}){

    let purchased = Array(0);

    React.useEffect(()=>{
        const json = localStorage.getItem('tycoon')
        let tycoon = new Tycoon('user', JSON.parse(json));
        const agency = tycoon.currentAgency();
        purchased = agency.attractions
    },[upgrade])


    return (<div className="attraction">
        {purchased.map((attraction)=>{
            <UpgradePic type={'attraction'} upgrade={attraction} />
        })}
        {upgrade && <UpgradeButton name={upgrade.name} type={'attraction'} 
            price={upgrade.price} clickgain={upgrade.clickgain}/>}
    </div>)

}

function ButtonHouse(){

    const[travel, changeTravel] = React.useState(undefined);
    const[hospitality, changeHospitality] = React.useState(undefined);
    const[attraction, changeAttraction] = React.useState(undefined);

    React.useEffect(()=>{
        fetch('/api/available').then((res)=> res.json()).then((json)=>{
            json.forEach(upgrade => {
                if (upgrade.type == 'travel'){
                    changeTravel(upgrade);
                } else if(upgrade.type == 'attraction'){
                    changeAttraction(upgrade);
                } else if(upgrade.type == 'hospitality'){
                    changeHospitality(upgrade)
                }
            });
        })
    },[])

    return(<div className="ui">
        <Money />
        <Hospitality upgrade={hospitality}/>
        <Attraction upgrade={attraction}/>
        <Travel upgrade={travel}/>
</div>)
}

