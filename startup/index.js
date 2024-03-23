const server = require ('./server');

try{
    run();
} catch (error){
    console.log(error);
}
finally{
    //stop the server and kill the connections?
}

async function run (){
    server.listen(4000);
    console.log(`Listening on port 4000`);
}
