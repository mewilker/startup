const protocol = window.location.protocol === 'http:' ? 'ws': 'wss';
const ws = new WebSocket(`${protocol}://${window.location.host}/ws`)
export const messages = []

ws.onopen = ()=>{
    console.log('connected to websocket')
}

ws.onclose = () =>{
    console.log('disconnected from websocket')
    clearInterval(sendClicks10Sec)
}

ws.onmessage = async (event) =>{
    const wsmsg = JSON.parse(event.data);
    messages.push(wsmsg)
}

export function sendClicks(){
    if (ws && ws.readyState != WebSocket.CLOSED){
        ws.send(`{"type":"clicks", "clicks":${localStorage.getItem('clicks')}}`)
    }
    localStorage.setItem('clicks', 0);
}

const sendClicks10Sec = setInterval(()=>{
    try {
        sendClicks()
    } catch (error) {
        throw new Error("Problem! Money was not saved!")
    }
},10000)
