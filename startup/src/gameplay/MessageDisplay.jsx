import React from "react"

export function MessageDisplay({ws}){
    const [messages, setMessage] = React.useState([])

    React.useEffect(()=>{
        if (ws){
            ws.registerHandler(handleMessage)
            setMessage(ws.notifications)
        }

        return()=>{
            if (ws){
                ws.sendClicks()
                ws.stopWebsocket()
            }
        }
    },[ws])

    React.useEffect(()=>{
        if (ws){
            setMessage(ws.notifications)
        }
    })

    function handleMessage(message){
        setMessage(messages.concat(message))
    }

    function handleMessageArray(messageArray){
        setMessage(messageArray)
    }

    function createMessageArray(){
        const messageArray = []
        for (const[i,message] of messages.entries()){
            messageArray.push(<Message key={i} message={message}/>)
        }
        return messageArray
    }

    return (<ul className="wsmsg">
        {createMessageArray()}
    </ul>)
}

function Message({message}){
    if (message.type == 'error'){
        return <li className="error">{message.message}</li>
    }
    return <li className="wsmsg">{message.message}</li>
}