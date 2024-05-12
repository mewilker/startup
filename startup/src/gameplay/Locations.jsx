import React from "react";
import './gameplay.css';
export function LocationPage(){
    return (
        <main className="agency">
            <h3>$<span id="money">money goes here</span></h3>
            <p className="confirm">Select where you want to upgrade!</p>
            <button className="confirm">Expand!</button>
            <Map />
        </main>
    )
}

function Map(){
    var map = L.map('map').setView([36.0544, -112.1401], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    return <div id='map'></div>
}