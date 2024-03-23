const express = require('express');
const server = express();
const uuid = require('uuid');
const db = require('./dbaccess');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const path = require('path')
//Static Home page call
//TODO: refactor project so gameplay is not public
server.use(express.static(path.join(__dirname, 'public')))
server.use(cookieParser());
server.use(express.json())
    
//Register User
server.post('/user', async function(req, res, next){ //TODO: add a next param to pass the response to login
    const user = req.body;
    try{
        if (user.username == undefined || user.password == undefined){
            throw new Error("bad request");
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
        if (user.username == undefined || user.password == undefined){
            throw new Error("bad request");
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
    d.setTime(d.getTime + 86400000)
    let authToken = {token: uuid.v4(), username: username, expires: d.getMilliseconds()};
    await db.addToken(authToken);
    res.cookie('authToken', authToken.token, 
        {maxAge: 86400000, 
            httpOnly: true, 
            //secure: true, 
            sameSite: 'strict'
        });
    res.send({});
}
    
//Get User
server.get('/session', async function (req, res, next){
    try{
        const cookies = req.cookies
        if (cookies.authToken){
            throw new Error('bad request')
        }
        let foundarray = await db.findTokenByAuth(cookies.authToken);
        if (foundarray)
    }
    catch(err){
        next(err);
    }

})

//Logout User
server.delete('/session', function (req, res, next){
    console.log('Logout');
})
    
//Get tycoon or agency
server.get('/tycoon', function (req, res, next){
    console.log('tycoon');
})

//Save tycoon or agency
server.put('/tycoon', function (req, res, next){
    console.log('saved');
})

    
//Get location?

//Update Gain?

//Get money?

//Get Purchased Locations?

//Get Possible Locations?

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

module.exports = server;