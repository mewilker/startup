const { MongoClient, Collection } = require('mongodb');
const config = require('./dbconfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const users = db.collection('users');
const tokens = db.collection('tokens');
const tycoons = db.collection('tycoons');

pingServer()
  .then(()=>{console.log('connected to Mongo')})
  .catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  })

async function pingServer(){
  await client.connect();
  await db.command({ping: 1});
}

function closeConnection(){
  client.close(true);
  console.log ('closed connections with Mongo');
}

async function addUser (user){
  //TODO: encrypt password
  await users.insertOne(user);
}

async function findUser (user){
  const cursor = users.find({username: user.username});
  result = await cursor.toArray();
  return result;
}

async function addToken (authToken){
  await tokens.insertOne(authToken);
}

function findTokenByName(user){
  console.log('function')
}

async function findTokenByAuth(authToken){
  const cursor = users.find({token: authToken});
  result = await cursor.toArray();
  return result;
}

function removeToken(authToken) {
  console.log('function')
}

process.on('SIGINT', function() {
  client.close(true);
  console.log('Mongo disconnected on app termination');
  process.exit(0);
});

module.exports = {addUser, addToken, findUser, pingServer, closeConnection, findTokenByAuth}