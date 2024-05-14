import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import './gameplay.css';
import 'leaflet/dist/leaflet.css';
import Tycoon from "../../service/public/tycoon.mjs";
import { useNavigate } from "react-router-dom";

export function LocationPage({user}){
    const [tycoon, setTycoon] = React.useState(
        new Tycoon({user}, JSON.parse(localStorage.getItem('tycoon')))
    )

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
                    <MovePin location = {tycoon.currentAgency().location} tycoon ={tycoon}></MovePin>
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
        <BuyPopup location={props.location}></BuyPopup>
    </Marker>
}

function BuyPopup(props){
    
    async function onClick(){
        try{
            props.tycoon.buyLocation(props.location);
            let tosend =  {name: props.location.name(), type: 'location', price: props.location.price(), clickgain: props.location.price(), notified:true}
            await fetch('/upgrade', {
                method:'PUT',
                headers: {
                  'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(tosend)
            })        
            window.location.href = "/agency";
        }
        catch (error){
            if (error.message == "Not enough money!"){
                //TODO: tell the user they don't have enough money
            }
            else{
                console.log(error);
            }
        }
    }

    return <Popup>
            <div style={{justifyContent:'center', fontSize:'17pt', flexDirection:'column'}}>
            <p className="confirm">Expand to {props.location.name()} for ${props.location.price()}?</p>
            <button style={{width:'auto'}}>Expand!</button>
            </div>
            </Popup>
}

function HerePin(props){
    return <Marker position={props.location.coordinates()}>
        <Popup>
            You are here!
        </Popup>
    </Marker>
}
