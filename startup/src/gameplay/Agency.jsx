import React from "react";
import './gameplay.css';

export function Agency(){    
    return(
        <main className="agency">
            <div className="agencyhead">
                <h2 id = 'agencytitle'>Welcome to <span id = "user">your</span>'s agency in <span id = 'location'>the United States</span>!</h2>
            </div>
            <div className="agencybod">
                <div className="wsmsg">
                    Websocket Goes here
                </div>
            </div>
            <div className="ui">
                <div className="basic">

                </div>
                <div className="hospitality"></div>
                <div className="attraction"></div>
                <div className="travel"></div>
            </div>
        </main>
    )
}