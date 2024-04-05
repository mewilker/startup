const app = require ('./server');
const {WebSocketServer} = require ('ws');
const wsserver = app.websocket.wsserver
try{
    run();
} catch (error){
    console.log(error);
}
finally{
    //stop the server and kill the connections?
}

async function run (){
   const server = app.server.listen(4000);

    server.on('upgrade', (request, socket, head) => {
        const cookies = request.headers.cookie;
        const keyvalue = cookies.split('=');
        let value = undefined
        for(let i=0; i < keyvalue.length; i++){
            if (keyvalue[i] == 'authToken'){
                value = keyvalue[i+1];
                if (value.includes(";")){
                    value = value.substring(0,value.length-2);
                }
            }
        }
        app.validateAuth(value).then(()=>{
            wsserver.handleUpgrade(request, socket, head, function done(ws) {
                wsserver.emit('connection', ws, request);
            });
        }).catch((error) => {
            console.log('unauthorized websocket attempt')
        })
    });
    console.log(`Listening on port 4000`);
}