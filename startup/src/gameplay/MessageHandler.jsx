import React from "react"

export function MessageHandler({ws}){
    const [messages, setMessage] = React.useState([])

    React.useEffect(()=>{
        if (ws){
            ws.registerHandler(handleMessage)
        }

        return()=>{
            if (ws){
                ws.sendClicks()
                ws.stopWebsocket()
            }
        }
    },[ws])

    function handleMessage(message){
        const copyArray = []
        messages.forEach(element => {
            copyArray.push(element)
        });
        copyArray.push(message)
        setMessage(copyArray)
    }

    function createMessageArray(){
        const messageArray = []
        for (const[i,message] of messages.entries()){
            messageArray.push(message.type=='error' ? <ErrorMessage key={i} message={message.message}/> : <Message key={i} message={message.message}/>)
        }
        return messageArray
    }

    return (<ul className="wsmsg">
        {createMessageArray()}
    </ul>)
}

function Message({message}){
    return <li className="wsmsg">{message}</li>
}

function ErrorMessage({message}){
    return <li className="error">{message}</li>
}