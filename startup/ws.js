const {WebSocketServer} = require ('ws');
const wsserver = new WebSocketServer({noServer: true})
const db = require('./dbaccess.js');
let Tycoon = undefined;
import ('./public/tycoon.mjs').then((module)=> {
    Tycoon = module.default;
    console.log('tycoon package imported')
});
let sessions = [];

wsserver.on('connection', async (ws, req)=>{
    const cookies = req.headers.cookie;
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
    found = await db.findTokenByAuth(value);
    const session = { id: sessions.length + 1, alive: true, ws: ws, auth:value, user: found[0].username};
    sessions.push(session);
    let lastmessage = new Date();
    //TODO: would be nice if session id was the auth token

    ws.on('pong', ()=>{
        session.alive = true;
    });

    ws.on('message',(data)=>{
        try{
            const msg = data.toString()
            console.log(msg);
            const text = JSON.parse(msg)
            if (text.type == 'clicks'){
                let timerecieved = new Date();
                let elapsetime = (timerecieved.getTime() - lastmessage.getTime())/1000
                if (elapsetime < 0){
                    let tosend = {type:'error', message: 'The server is recieving too many websockets'}
                    console.log(tosend);
                    session.ws.send(JSON.stringify(tosend))
                }
                if(text.clicks > elapsetime * 20 || text.clicks < 0){
                    let tosend = {type:'error', message: 'The server has detected an unsual number of clicks. Please refresh the page.'}
                    console.log(tosend);
                    session.ws.send(JSON.stringify(tosend));
                }
                else if (text.clicks == 0){
                    //do nothing
                }
                else{
                    db.findTycoon(session.user).then((json)=>{
                        const tycoon = new Tycoon(session.user, JSON.parse(json));
                        for (let i = 0; i < text.clicks; i++){
                            tycoon.bookTours();
                        }
                        let toupdate = {money: tycoon.money()}
                        db.updateTycoon(session.user, toupdate).catch((error)=>{
                            console.log(error);
                        });
                    }).catch((error)=>{
                        console.log(error);
                    })
                }
                lastmessage = timerecieved;
            }
        } catch (err){
            console.log(err);
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
    sessions.forEach((session)=>{
        session.ws.send(message);
    })
}

module.exports = {wsserver, sendToAll}