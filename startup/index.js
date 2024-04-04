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
        wsserver.handleUpgrade(request, socket, head, function done(ws) {
            wsserver.emit('connection', ws, request);
        });
    });
    console.log(`Listening on port 4000`);
}