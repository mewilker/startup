const express = require('express');
const server = express();
const uuid = require('uuid');
const db = require('./dbaccess.js');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const path = require('path')
let Tycoon = undefined;
import ('./public/tycoon.mjs').then((module)=> {
    Tycoon = module.default;
    console.log('tycoon package imported')
  });
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

server.get("/agency", async function(req, res, next){
    try{
        const cookies = req.cookies;
        await validateAuth(cookies.authToken, res);
        res.sendFile(path.join(__dirname, '/public/agency.html'))
    }
    catch(err){
        next(err);
    }
})

server.get("/login", async function(req, res, next){
    res.sendFile(path.join(__dirname, 'public/login.html'))
})
    
//Register User
server.post('/user', async function(req, res, next){
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
server.post('/session', async function (req, res, next){
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
            //secure: true, 
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
        res.redirect(304, '/login');
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
server.get('/session', async function (req, res, next){
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
server.delete('/session', async function (req, res, next){
    try{
        const cookies = req.cookies
        let foundarray = await validateAuth(cookies.authToken, res);
        db.removeToken(foundarray[0]);
        res.cookie('authToken', '', {maxAge: -1, 
            httpOnly: true, 
            //secure: true, 
            sameSite: 'strict'
        })
        res.send();
    }
    catch(err){
        next(err);
    }
})
    
//Get tycoon or agency
server.get('/tycoon', async function (req, res, next){
    try{
        const cookies = req.cookies
        let foundarray = await validateAuth(cookies.authToken, res);
        res.send(await db.findTycoon(foundarray[0].username));
    }
    catch(err){
        next(err);
    }
})

//Save tycoon or agency
//TODO: CHANGE SO IT ONLY SAVES MONEY
//this todo is still not a great fix
server.put('/tycoon', async function (req, res, next){
    try{
        const tycoon = req.body;
        const cookies = req.cookies
        let foundarray = await validateAuth(cookies.authToken, res);
        await db.updateTycoon(foundarray[0].username, tycoon)
        res.send({});
    }
    catch(err){
        next(err);
    }
})

//Get scores
server.get('/scores', async function (req, res, next){
    try{
        res.send(await db.getScores());
    }
    catch(err){
        next(err);
    }
})

server.get('/available', async function(req, res, next){
    try{
        const cookies = req.cookies;
        let foundarray = await validateAuth(cookies.authToken, res);
        const user = foundarray[0].username;
        const json =await db.findTycoon(user);
        const tycoon = new Tycoon(user, JSON.parse(json));
        const agency = tycoon.currentAgency();
        //read csv
        const csv = require('./csv.js')
        switch (agency.location.name()) {
            case 'the Grand Canyon':    
                break;
        
            default:
                throw new Error('not a valid agency');
        }

        const lines = csv.split('\n');
        for (let lineIndex = 1; lineIndex < lines.length; lineIndex++){
        const line = lines[lineIndex];
        const values = line.split(",");
        const price = parseFloat(values[5])
        const clickgain = parseFloat(values[6]);
        switch(values[1]){
            case "travel":
                if (values[2]==agency.travel.length 
                  && values[3]<=agency.hospitality.length
                  && values [4]<=agency.attractions.length){
                    let obj = {name:values[0], type:values[1],price:price,clickgain:clickgain}
                    res.send(obj)
                    //createUpgradeButton(values[0],values[1],price, clickgain);
                }
                break;
            case "hospitality":
                if (values[2]<=agency.travel.length 
                  && values[3]==agency.hospitality.length
                  && values [4]<=agency.attractions.length){
                    //createUpgradeButton(values[0], values[1],price, clickgain);
                }
                break;
            case "attraction":
                if (values[2]<=agency.travel.length 
                  && values[3]<=agency.hospitality.length
                  && values [4]==agency.attractions.length){
                    //createUpgradeButton(values[0], values[1],price, clickgain);
                }
            break;
            case "location":
                if (values[2]<=agency.travel.length 
                  && values[3]<=agency.hospitality.length
                  && values [4]<=agency.attractions.length){
                    let bought = agency.findLocation(values[0]);
                    if (bought == null){
                        let msg = "A new location is available in " + values[0] + "! Check out the locations tab!"
                        addMessage(msg);
                        agency.addAvailableLocation(values[0]);
                        saveTycoon(tycoon.tojson());
                    }
                    else if (!bought){
                        let msg = "A new location is available in " + values[0] + "!"
                        addMessage(msg);
                    }
                }
                break;
            default:
                throw new Error("Bad File");
            } 
        }
    }
    catch(err){
        next(err);
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
    else{
        res.status(500)
    }
    res.send({message: err.message})
})

//TODO: make a function that cleans out the auth tokens every 24 hours or something like that

module.exports = server;