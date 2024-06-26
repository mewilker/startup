const express = require('express');
const server = express();
const uuid = require('uuid');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const path = require('path')
const db = require('./dbaccess.js');
let Tycoon = undefined;
import ('./public/tycoon.mjs').then((module)=> {
    Tycoon = module.default;
    console.log('tycoon package imported')
});
let Location = undefined;
import ('./public/location.mjs').then((module)=>{
    Location = module.default;
    console.log('location package imported');
})

const websocket = require('./ws.js')
const csv = require('./csv.js');
//Static Home page call
//TODO: refactor project so gameplay is not public
server.use(express.static(path.join(__dirname, 'public')))
server.use(cookieParser());
server.use(express.json())
const userRegex = /^[a-zA-Z0-9@!_]*/
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

server.use((req, res, next)=>{
    res.on("finish", function() {
    console.log(req.method, decodeURI(req.url), res.statusCode, res.statusMessage);
  });
  //TODO more logging
  next();
})
    
//Register User
server.post('/api/user', async function(req, res, next){
    try{
        const user = req.body;
        if (user.username == undefined || user.password == undefined || user.username.length > 20){
            throw new Error("bad request");
        }
        const match = user.username.match(userRegex)
        if (match.length != 1 || match[0] == ''){
            throw new Error("bad request")
        }
        let found = await db.findUser(user);
        if (found.length == 0){
            user.password = await bcrypt.hash(user.password, 10);
            await db.addUser(user);
            setAuthCookie(res, user.username)
        }
        else{
            throw new Error("already taken");
        }
    } catch (err){
        next(err);
    }
    
            
})
    
//Login User
server.post('/api/session', async function (req, res, next){
    try{    
        const user = req.body;
        if (user.username == undefined || user.password == undefined || user.username.length > 20){
            throw new Error("bad request");
        }
        const match = user.username.match(userRegex)
        if (match.length != 1 || match[0] == ''){
            throw new Error('bad request')
        }
        let foundarray = await db.findUser(user);
        let same = false;
        try{
            let found = foundarray[0]
            same = await bcrypt.compare(user.password, found.password);
        }
        catch(err){
            throw new Error("unauthorized");
        }
        if (same){
            setAuthCookie(res, user.username);
        }
        else{ 
            throw new Error("unauthorized");
        }  
    }
    catch (err){
        next(err);
    }
})

async function setAuthCookie (res, username){
    let d = new Date();
    d.setTime(d.getTime() + 86400000)
    let authToken = {token: uuid.v4(), username: username, expires: d.valueOf()};
    await db.addToken(authToken);
    res.cookie('authToken', authToken.token, 
        {maxAge: 86400000, 
            httpOnly: true, 
            secure: true, 
            sameSite: 'strict'
        });
    res.send({});
}

async function validateAuth(authToken, res){
    if (!authToken){
        throw new Error('bad request')
    }
    const match =authToken.match(uuidRegex);
    if (match.length != 1 || match[0] == ''){
        throw new Error('bad request');
    }
    let foundarray = await db.findTokenByAuth(authToken);
    if (foundarray.length == 0){
        throw new Error('unauthorized');
    }
    let d = new Date();
    if (foundarray[0].expires <= d.valueOf()){
        db.removeToken(foundarray[0]);
        throw new Error('unauthorized');
    }
    return foundarray;
}
    
//Get User
server.get('/api/session', async function (req, res, next){
    try{
        const cookies = req.cookies
        let foundarray = await validateAuth(cookies.authToken, res);
        res.send(JSON.stringify({user:foundarray[0].username}));
    }
    catch(err){
        next(err);
    }

})

//Logout User
server.delete('/api/session', async function (req, res, next){
    try{
        const cookies = req.cookies
        let foundarray = await validateAuth(cookies.authToken, res);
        db.removeToken(foundarray[0]);
        res.cookie('authToken', '', {maxAge: -1, 
            httpOnly: true, 
            secure: true, 
            sameSite: 'strict'
        })
        res.send();
    }
    catch(err){
        next(err);
    }
})
    
//Get tycoon or agency
server.get('/api/tycoon', async function (req, res, next){
    try{
        const cookies = req.cookies
        let foundarray = await validateAuth(cookies.authToken, res);
        res.send(await db.findTycoon(foundarray[0].username));
    }
    catch(err){
        next(err);
    }
})

//Get scores
server.get('/api/scores', async function (req, res, next){
    try{
        res.send(await db.getScores());
    }
    catch(err){
        next(err);
    }
})

function findCSV (name){
    switch (name) {
        case 'the Grand Canyon':
            return csv.GrandCanyon;
        case 'New York':
            return csv.NewYork;
        case 'Banff':
            return csv.Banff;
        case 'Cabo San Lucas':
            return csv.Cabo;
        case 'Hawaii':
            return csv.Hawaii;
        case 'the British Virgin Isles':
            return csv.BVI;
        case 'Australia':
            return csv.Australia;
        case 'London':
            return csv.London;
        case 'Japan':
            return csv.Japan;
        default:
            throw new Error('bad request');
    }
}

function parseCSV(csv, agency){
    const lines = csv.split('\n');
    const upgrades = []
    for (let lineIndex = 1; lineIndex < lines.length; lineIndex++){
        const line = lines[lineIndex];
        const values = line.split(",");
        const price = parseFloat(values[5])
        const clickgain = parseFloat(values[6]);
        let obj = {name:values[0], type:values[1],price:price,clickgain:clickgain}
        switch(values[1]){
            case "travel":
                if (values[2]==agency.travel.length 
                    && values[3]<=agency.hospitality.length
                    && values[4]<=agency.attractions.length){
                    upgrades.push(obj)
                }
            break;
            case "hospitality":
                if (values[2]<=agency.travel.length 
                    && values[3]==agency.hospitality.length
                    && values[4]<=agency.attractions.length){
                    upgrades.push(obj)
                }
            break;
            case "attraction":
                if (values[2]<=agency.travel.length 
                    && values[3]<=agency.hospitality.length
                    && values[4]==agency.attractions.length){
                    upgrades.push(obj)
                }
            break;
            case "location":
                if (values[2]<=agency.travel.length 
                    && values[3]<=agency.hospitality.length
                    && values[4]<=agency.attractions.length){
                    let bought = agency.findLocation(values[0]);
                if (bought == null){
                    upgrades.push(obj)
                    agency.addAvailableLocation(values[0])
                }
                else if (!bought){
                    obj.notified = true;
                    upgrades.push(obj)
                }
            }
            break;
        default:
            throw new Error("bad csv");
        } 
    }
    return upgrades;
}

server.get('/api/available', async function(req, res, next){
    try{
        const cookies = req.cookies;
        let foundarray = await validateAuth(cookies.authToken, res);
        const user = foundarray[0].username;
        const json = await db.findTycoon(user);
        const tycoon = new Tycoon(user, JSON.parse(json));
        const agency = tycoon.currentAgency();
        let upgrades = findCSV(agency.location.name())
        tycoon.getPossibleLocations();
        upgrades = parseCSV(upgrades, agency)
        let obj = JSON.parse(tycoon.tojson())
        db.updateTycoon(user, obj);
        res.send(upgrades);
    }
    catch(err){
        next(err);
    }
})

server.put('/api/upgrade', async function (req, res, next){
    try{
        const cookies = req.cookies;
        let foundarray = await validateAuth(cookies.authToken, res);
        const user = foundarray[0].username;
        const json = await db.findTycoon(user);
        const tycoon = new Tycoon(user, JSON.parse(json));
        const agency = tycoon.currentAgency();
        let upgrades = findCSV(agency.location.name());
        upgrades = parseCSV(upgrades, agency);
        const upgrade = req.body;
        let responsesent = false;
        for (let i = 0; i < upgrades.length; i++) {
            if (deepEquals(upgrade, upgrades[i])){
                if (upgrade.type == 'location'){
                    let addme = new Location(upgrade.name);
                    tycoon.buyLocation(addme);
                    websocket.sendToAll(`{"type":"location", "message":"${user} has bought an agency in ${upgrade.name}!"}`)
                }
                else{
                    tycoon.buy(upgrade.price)
                    switch (upgrade.type) {
                        case 'travel':
                            agency.addTravel(upgrade)
                        break;
                        case 'hospitality':
                            agency.addHospitality(upgrade)
                        break;
                        case 'attraction':
                            agency.addAttraction(upgrade)
                        break;                    
                        default:
                            throw new Error('bad request');
                    }
                    tycoon.calculateGain();
                }
                let obj = JSON.parse(tycoon.tojson())
                //for some reason mongo doesn't like having the straight tycoon passed to it
                await db.updateTycoon(user, obj);
                res.send(tycoon.tojson())
                responsesent = true;
            }
        }
        if (!responsesent){
            throw new Error('bad request');
        }
    } catch (err){
        next(err);
    }
})

server.put('/api/move', async function (req, res, next){
    try{
        const cookies = req.cookies;
        let foundarray = await validateAuth(cookies.authToken, res);
        const user = foundarray[0].username;
        const json = await db.findTycoon(user);
        const tycoon = new Tycoon(user, JSON.parse(json));
        const whereTo = req.body;
        tycoon.moveLocation(whereTo.name);
        let obj = JSON.parse(tycoon.tojson())
        await db.updateTycoon(user, obj);
        res.send(tycoon.tojson());
    } catch (err){
        next (err)
    }
})

server.use((err, req, res, next) => {
    if (err.message == "bad request"){
        res.status(400)
    } 
    else if (err.message == "already taken"){
        res.status(403)
    }
    else if (err.message == "unauthorized"){
        res.status(401)
    }
    else if (err.message == "Not enough money!"){
        res.status(400)
    }
    else{
        res.status(500)
    }
    res.send({message: err.message})
})

function deepEquals(obj1, obj2){
    return JSON.stringify(obj1) == JSON.stringify(obj2);
}
//TODO: make a function that cleans out the auth tokens every 24 hours or something like that

module.exports = {server, websocket, validateAuth};