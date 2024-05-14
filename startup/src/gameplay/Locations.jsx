import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './gameplay.css';
import 'leaflet/dist/leaflet.css';
import Tycoon from "../../service/public/tycoon.mjs";
import { useNavigate } from "react-router-dom";


export function LocationPage({user}){
    const navigate = useNavigate()
    const [tycoon, setTycoon] = React.useState(
        new Tycoon({user}, JSON.parse(localStorage.getItem('tycoon')))
    )

    function createBuyPinArray(){
        const buyPins = []
        tycoon.getPossibleLocations().forEach(location=>{
            buyPins.push(<BuyPin location={location} tycoon={tycoon}></BuyPin>)
        })
        return buyPins
    }

    function createMovePinArray(){
        const movePins=[]
        tycoon.getPurchasedLocations().forEach(location=>{
            const pin = location.name()==tycoon.currentAgency().location.name() ? 
                <HerePin location={location}></HerePin> : <MovePin location={location} tycoon={tycoon}></MovePin>
            movePins.push(pin)
        })
        return movePins
    }

    React.useEffect(()=>{
        async function fetchData(){
            const response = await fetch('/api/tycoon');
            if (!response.ok){
                navigate('/login')
            }
            const tycoonjson = await response.json();
            const tycoon = new Tycoon({user},tycoonjson)
            localStorage.setItem('tycoon', tycoon.tojson())
            setTycoon(tycoon)
        }

        fetchData()
    },[])

    return (
        <main className="agency">
            <h2 id='agencytitle'>Expand your travel agency!</h2>
            <div className="travelhead">
                <div className="stats">
                <h3>$<span id="money">{tycoon.money().toFixed(2)}</span></h3>
                <p className="confirm">Select where you want to upgrade!</p>
                </div>
                <MapContainer style={{flex: 1, height: '100%', margin:0, flexWrap: 'none', display: 'block'}} 
                    center={[24.0544, -112.1401]} zoom={2} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    {createBuyPinArray()}
                    {createMovePinArray()}
                </MapContainer>
            </div>
        </main>
    )
}

function MovePin(props){
    return <Marker position={props.location.coordinates()}>
        <MovePopup location={props.location} tycoon = {props.tycoon}></MovePopup>
    </Marker>
}

function MovePopup(props){

    const navigate = useNavigate();
    
    async function onClick(){
        try{
            props.tycoon.moveLocation(props.location.name());
            await fetch('/api/move', {
                method:'PUT',
                headers: {
                  'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({name:props.location.name()})
            })
        } catch (error){
            console.log(error);
        }
        navigate('/agency');
    }
    
    return <Popup>
            <div style={{justifyContent:'center', fontSize:'17pt', flexDirection:'column'}}>
            <p className="confirm">Move to {props.location.name()}?</p>
            <button style={{width:'auto'}} onClick={onClick}>Let's go!</button>
            </div>
            </Popup>
}

function BuyPin(props){
    return <Marker position={props.location.coordinates()}>
        <BuyPopup location={props.location} tycoon={props.tycoon}></BuyPopup>
    </Marker>
}

function BuyPopup(props){

    const navigate = useNavigate();
    const [prompt, setPrompt] = React.useState( `Expand to ${props.location.name()} for $${props.location.price()}?`)
    
    React.useEffect(()=>{},[prompt])

    function tenSecondMessage(message){
        if (message != prompt){    
            const tempPrompt = prompt
            setPrompt(message)
            setTimeout(()=>{setPrompt(tempPrompt)}, 3000)
        }
    }
    
    async function onClick(){
        try{
            props.tycoon.buyLocation(props.location);
            let tosend =  {name: props.location.name(), type: 'location', price: props.location.price(), clickgain: props.location.price(), notified:true}
            const res = await fetch('/api/upgrade', {
                method:'PUT',
                headers: {
                  'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(tosend)
            })
            if (res.ok) {
                navigate('/agency')
            }       
        }
        catch (error){
            if (error.message == "Not enough money!"){
                tenSecondMessage(error.message)
            }
            else{
                console.log(error);
            }
        }
    }

    return <Popup>
            <div style={{justifyContent:'center', fontSize:'17pt', flexDirection:'column'}}>
                <p className="confirm">{prompt}</p>
                <button style={{width:'auto'}} onClick={onClick}>Expand!</button>
            </div>
        </Popup>
}

function HerePin(props){
    return <Marker position={props.location.coordinates()}>
        <Popup>
            <div style={{justifyContent:'center', fontSize:'17pt', flexDirection:'column'}}>
                <p className="confirm">You are here!</p>
            </div>
        </Popup>
    </Marker>
}
