const server = require ('./server');

try{
    run();
} catch (error){
    console.log(error);
}

async function run (){
    server.listen(4000);
    console.log(`Listening on port 4000`);
}
