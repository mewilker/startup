const express = require('express');
const server = express();
const uuid = require('uuid');
const db = require('./dbaccess');
const cookieParser = require('cookie-parser');
//Static Home page call
//TODO: refactor project so gameplay is not public
server.use(express.static('public'))
server.use(cookieParser());
server.use(express.json())
    
//Register User
server.post('/user', async function(req, res){ //TODO: add a next param to pass the response to login
    const user = req.body;
    if (user.username == undefined || user.password == undefined){
        throw new Error("bad request");
    }
    let found = await db.findUser(user);
    if (found.length == 0){
        await db.addUser(user);
        let authToken = {token: uuid.v4(), username: user.username};
        await db.addToken(authToken);
        res.cookie('authToken', authToken.token, 
            {maxAge: 86400000, httpOnly: true, secure: true, sameSite: 'strict'});
        res.send({});
    }
    else{
        throw new Error("already taken");
    }

})
    
//Login User
server.post('/session', function (req, res){
    const user = req.body;
    if (user.username == undefined || user.password == undefined){
        throw new Error("bad request");
    }
    
})
    
//Get User
server.get('/session', function (req, res){
    console.log("Username");
})

//Logout User
server.delete('/session', function (req, res){
    console.log('Logout');
})
    
//Get tycoon or agency
server.get('/tycoon', function (req, res){
    console.log('tycoon');
})

//Save tycoon or agency
server.put('/tycoon', function (req, res){
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
    else{
        res.status(500)
    }
    res.send({message: err.message})
})

module.exports = server;