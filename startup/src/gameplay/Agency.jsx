import React from "react";
import './gameplay.css';
import Tycoon from "../../service/public/tycoon.mjs";
import { Hospitality, Travel, Attraction} from "../../service/public/agency.mjs";

export function Agency({user}){
    const [location, changeLocation] = React.useState(null);
    const [imgurl, changeurl] = React.useState('src/assets/placehold.jpg');
    const [author, changeauthor] = React.useState(null);
    const [clicks, changeClicks] = React.useState(0);
    const [money, changeMoney] = React.useState(0);
    
    React.useEffect(()=>{
        async function fetchData(){
            const response = await fetch('/api/tycoon');
            if (!response.ok){

            }
            const tycoonjson = await response.json();
            const tycoon = new Tycoon({user},tycoonjson)
            localStorage.setItem('tycoon', tycoon.tojson())
            const agency = tycoon.currentAgency();
            changeLocation(agency.place());
            const id = agency.location.picsumid()
            changeMoney(tycoon.money())
            try{
                const res = await fetch('https://picsum.photos/id/'+id + '/300/300')
                if (res.ok){
                    changeurl(res.url)
                }
                const authorres = await fetch('https://picsum.photos/id/'+id+'/info')
                const json = authorres.json()
                changeauthor(json.author)
            }
            catch(err){
                console.log(err)
            }
        }
        
        fetchData()
    },[])

    function resetClicks(){
        changeClicks(0)
    }

    function incrementClicks(){
        changeClicks(clicks+1)
    }

    return(
        <main className="agency" style={imgurl &&{ backgroundImage: `url(${imgurl})` }}>
            <div className="agencyhead">
                <h2 id = 'agencytitle'>Welcome to <span id = "user">{user}</span>'s agency in <span id = 'location'>{location}</span>!</h2>
            </div>
            <div className="agencybod">
                <div className="wsmsg">
                    <WebsocketFacade clicks={clicks} reset={resetClicks}/>
                </div>
                <ButtonHouse money={money} changeMoney={changeMoney} click={incrementClicks}/>
            </div>
        </main>
    )
}

function WebsocketFacade({clicks, reset}){
    const [messages, addMessages] = React.useState(Array(0))
    const [socket, changeSocket] = React.useState(undefined);

    React.useEffect(()=>{
        
        const protocol = window.location.protocol === 'http:' ? 'ws': 'wss';
        const ws = new WebSocket(`${protocol}://${window.location.host}/ws`)

        ws.onopen = ()=>{
            console.log('connected to websocket')
        }

        ws.onclose = () =>{
            console.log('disconnected from websocket')
        }

        ws.onmessage = async (event) =>{
            const wsmsg = JSON.parse(event.data);
            messages.push(wsmsg)
        }

        changeSocket(ws)

        return()=>{ws.close()}


    },[])

    function sendMessage(message){
        if (socket && socket.readyState != WebSocket.CLOSED){
            socket.send(message)
        }
    }

    setInterval(()=>{
        try {
            sendMessage(`{"type":"clicks", "clicks":${clicks}}`)
            reset();
        } catch (error) {
            messages.push({type:'error', message:"Problem! Money was not saved!"})
        }
    },10000)

    return (<ul className="wsmsg">
        {messages.map((wsmsg, index)=>(
            wsmsg.type=='error' ? <ErrorMessage message={wsmsg.message}/> : <Message message={wsmsg.message}/>
        ))}
    </ul>)
}

function Message({message}){
    return <li className="wsmsg">{message}</li>
}

function ErrorMessage({message}){
    return <li className="error">{message}</li>
}

function Money({money, changeMoney, click}){
    const [amount, changeAmount] = React.useState(0.01)
    const [clicks, changeclicks] = React.useState(0)
    
    React.useEffect(()=>{
        const json = localStorage.getItem('tycoon')
        let tycoon = new Tycoon('user', JSON.parse(json));
        if (clicks > 0){
            tycoon.bookTours()
        }
        changeMoney(tycoon.money())
        localStorage.setItem('tycoon', tycoon.tojson())
    },[money])

    return (
        <div className="basic">
            <h3 className="basic">$<span id = 'money'>{money.toFixed(2)}</span></h3>
            <button className="basic" onClick={click}>Book Tours</button>
        </div>
    )
}

function UpgradePic({type, upgrade}){
    return <img className={type} alt={upgrade.type()} src={upgrade.imgpath()}/>
}

function UpgradeButton({name, type, price, onClick}){
    return <button className={type} onClick={onClick}>Buy {name} ${price}</button>
}

function TravelComp({upgrade,buy,reset}){

    const [purchased, setPurchased] = React.useState(Array(0))

    React.useEffect(()=>{
        const json = localStorage.getItem('tycoon')
        let tycoon = new Tycoon('user', JSON.parse(json));
        const agency = tycoon.currentAgency();
        setPurchased(agency.travel)
    },[upgrade])

    async function buyUpgrade(){
        const before = localStorage.getItem('tycoon')
        await buy(upgrade);
        const json = localStorage.getItem('tycoon')
        if (before !== json){
            let tycoon = new Tycoon('user', JSON.parse(json));
            const agency =tycoon.currentAgency();
            const purchase = new Travel(upgrade.name,upgrade.price,upgrade.clickgain);
            agency.travel.push(purchase);
            tycoon.calculateGain();
            localStorage.setItem('tycoon', tycoon.tojson())
            reset(undefined);
        }
    }
    
    return (<div className="travel">
        {purchased.map((travel, index)=>(
            <UpgradePic key={index} type={'travel'} upgrade={travel} />
        ))}
        {upgrade && <UpgradeButton name={upgrade.name} type={'travel'} 
            price={upgrade.price} onClick={buyUpgrade}/>}
    </div>)
}

function HospitalityComp({upgrade, buy, reset}){
    
    const [purchased, setPurchased] = React.useState(Array(0))

    React.useEffect(()=>{
        const json = localStorage.getItem('tycoon')
        let tycoon = new Tycoon('user', JSON.parse(json));
        const agency = tycoon.currentAgency();
        setPurchased(agency.hospitality)
    },[upgrade])

    async function buyUpgrade(){
        const before = localStorage.getItem('tycoon')
        await buy(upgrade);
        const json = localStorage.getItem('tycoon')
        if (before !== json){
            let tycoon = new Tycoon('user', JSON.parse(json));
            const agency =tycoon.currentAgency();
            const purchase = new Hospitality(upgrade.name,upgrade.price,upgrade.clickgain);
            agency.hospitality.push(purchase);
            tycoon.calculateGain();
            localStorage.setItem('tycoon', tycoon.tojson())
            reset(undefined)
        }
    }


    return (<div className="hospitality">
        {purchased.map((hospitality, index)=>(
            <UpgradePic key={index} type={'hospitality'} upgrade={hospitality} />
        ))}
        {upgrade && <UpgradeButton name={upgrade.name} type={'hospitality'} 
            price={upgrade.price} onClick={buyUpgrade}/>}
    </div>)
}

function AttractionComp({upgrade,buy,reset}){

    const [purchased, setPurchased] = React.useState(Array(0))

    React.useEffect(()=>{
        const json = localStorage.getItem('tycoon')
        let tycoon = new Tycoon('user', JSON.parse(json));
        const agency = tycoon.currentAgency();
        setPurchased(agency.attractions)
    },[upgrade])

    async function buyUpgrade(){
        const before = localStorage.getItem('tycoon')
        await buy(upgrade);
        const json = localStorage.getItem('tycoon')
        if (before !== json){
            let tycoon = new Tycoon('user', JSON.parse(json));
            const agency =tycoon.currentAgency();
            const purchase = new Attraction(upgrade.name,upgrade.price,upgrade.clickgain);
            agency.attractions.push(purchase);
            tycoon.calculateGain();
            localStorage.setItem('tycoon', tycoon.tojson())
            reset(undefined)
        }
    }


    return (<div className="attraction">
        {purchased.map((attraction, index)=>(
            <UpgradePic key={index} type={'attraction'} upgrade={attraction} />
        ))}
        {upgrade && <UpgradeButton name={upgrade.name} type={'attraction'} 
            price={upgrade.price} onClick={buyUpgrade}/>}
    </div>)

}

function ButtonHouse({money, changeMoney, click}){

    const[travelUpgrade, changeTravel] = React.useState(undefined);
    const[hospitalityUpgrade, changeHospitality] = React.useState(undefined);
    const[attractionUpgrade, changeAttraction] = React.useState(undefined);

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
    },[travelUpgrade, hospitalityUpgrade, attractionUpgrade])

    async function buyUpgrade(upgrade){
        const json = localStorage.getItem('tycoon')
        const tycoon = new Tycoon('user', JSON.parse(json));
        try{
            tycoon.buy(upgrade.price)
            await fetch('/api/upgrade',{
                method:'PUT',
                headers: {
                'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(upgrade)
            })
            localStorage.setItem('tycoon', tycoon.tojson());
        }
        catch(error){
            if (error.message == "Not enough money!"){
                <ErrorMessage message={error.message}/>
                //or something like this... but it needs to go in the ws
            }
            else{
                console.log(error);
            }
        }
    }

    return(<div className="ui">
        <Money money={money} changeMoney={changeMoney} click={click}/>
        <HospitalityComp upgrade={hospitalityUpgrade} buy={buyUpgrade} reset={changeHospitality}/>
        <AttractionComp upgrade={attractionUpgrade} buy={buyUpgrade} reset={changeAttraction}/>
        <TravelComp upgrade={travelUpgrade} buy={buyUpgrade} reset={changeTravel}/>
</div>)
}

