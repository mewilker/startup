import React from "react";
import './leaderboard.css'

/*const overwriteStyle = {
    flex-direction: 'column',
    justify-content: 'start',
    font-size: '17pt',
}*/

export function Leaderboard(){
    return (
        <main>
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr id = 'headers'>
                        <th className="rank">Rank</th>
                        <th className="user">Username</th>
                        <th className="score">Score</th>
                    </tr>
                </thead>
                <ScoresBody />
            </table>
        </main>
    )
}

function ScoresBody(){
    const [scores,setScores] = React.useState([])

    React.useEffect(()=>{
        fetch('/api/scores').then((res)=>{
            res.json().then((result)=>{setScores(result)})
        });
    },[]);
    const scoreRows = [];
    for (let i = scores.length-1; i >= 0; i--){
        let obj = scores[i];
        scoreRows.push(
            <tr key={i+1}>
                <td className="rank">{i+1}</td>
                <td className="user">{obj.user}</td>
                <td className="score">{`$${obj.money}`}</td>
            </tr>
        )
    }
    return (
        <tbody>
            {scoreRows}
        </tbody>
    )
}


