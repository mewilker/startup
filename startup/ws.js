const {WebSocketServer} = require ('ws');
const wsserver = new WebSocketServer({noServer: true})
let sessions = [];

wsserver.on('connection', (ws)=>{
    const session = { id: sessions.length + 1, alive: true, ws: ws };
    sessions.push(session);
    //TODO: would be nice if session id was the auth token

    ws.on('pong', ()=>{
        session.alive = true;
    });

    ws.on('message',(data)=>{
        if (data.type == 'clicks'){
            //update money logic
        }
    })
    
    ws.on('close', () => {
        sessions.findIndex((o, i) => {
            if (o.id === session.id) {
                sessions.splice(i, 1);
                return true;
                //i think what this function is doing is removing the connection from the session array
            }
        });
    });
})

setInterval(() => {
    sessions.forEach((session) => {
      // Kill any connection that didn't respond to the ping last time
      if (!session.alive) {
        session.ws.terminate();
      } else {
        session.alive = false;
        session.ws.ping();
      }
    });
}, 10000);

function sendToAll(message){
    console.log(message);
    sessions.forEach((session)=>{
        session.ws.send(message);
    })
}

module.exports = {wsserver, sendToAll}