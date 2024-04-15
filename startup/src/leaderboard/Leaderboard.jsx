import React from "react";
import './leaderboard.css'

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
            </table>
        </main>
    )
}

