import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import './gameplay.css';
import 'leaflet/dist/leaflet.css';
export function LocationPage(){
    return (
        <main className="agency">
            <h2 id='agencytitle'>Expand your travel agency!</h2>
            <div className="travelhead">
                <div className="stats">
                <h3>$<span id="money">money goes here</span></h3>
                <p className="confirm">Select where you want to upgrade!</p>
                <button className="confirm">Expand!</button>
                </div>
                <MapContainer style={{flex: 1, height: '100%', margin:0, flexWrap: 'none', 'align-items':'start'}} 
                    center={[36.0544, -112.1401]} zoom={3} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </main>
    )
}
