const express = require('express');
const server = express();

try{
    server.listen(4000);
    console.log(`Listening on port 4000`);
    
    //Static Home page call
    server.use(express.static('public'))
    
    //Create User
    
    //Login User
    
    //Get User
    
    //Get tycoon or agency
} catch (error){
    console.log(error);
}
