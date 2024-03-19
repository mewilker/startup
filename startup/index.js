const express = require('express');
const server = express();

try{
    server.listen(4000);
    console.log(`Listening on port 4000`);
    
    //Static Home page call
    //TODO: refactor project so gameplay is not public
    server.use(express.static('public'))
    
    //Register User
    server.post('/user', function(req, res){ //TODO: add a next param to pass the response to login
        console.log("Register");
    })
    
    //Login User
    server.post('/session', function (req, res){
        console.log("Login");
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

} catch (error){
    console.log(error);
}
