export class WebSocketManager{


    constructor(){

        const protocol = window.location.protocol === 'http:' ? 'ws': 'wss';
        this.ws = new WebSocket(`${protocol}://${window.location.host}/ws`)
        
        this.ws.onopen = ()=>{
            console.log('connected to websocket')
        }
        
        this.ws.onclose = () =>{
            console.log('disconnected from websocket')
            clearInterval(this.sendClicks10Sec)
        }
        
        this.ws.onmessage = async (event) =>{
            const wsmsg = JSON.parse(event.data);
            this.handler(wsmsg)
        }

        this.sendClicks10Sec = setInterval(()=>{
            try {
                this.sendClicks()
            } catch (error) {
                throw new Error("Problem! Money was not saved!")
            }
        },10000)
    }
    
    sendClicks(){
        if (this.ws && this.ws.readyState != WebSocket.CLOSED){
            this.ws.send(`{"type":"clicks", "clicks":${localStorage.getItem('clicks')}}`)
        }
        localStorage.setItem('clicks', 0);
    }
    
    addError(message){
        let notification = {
            type: 'error',
            message:message
        }
        this.handler(notification)
    }

    handler = (message)=>{
        console.log(message);
    }

    addNotification(message){
        let notification = {
            type:'notification',
            message:message
        }
        this.handler(notification)
    }

    registerHandler(handler){
        this.handler = handler
    }

    stopWebsocket(){
        this.ws.close()
        clearInterval(this.sendClicks10Sec);
        console.log('disconnected from websocket')
    }
    
}
    