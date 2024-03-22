const { MongoClient, Collection } = require('mongodb');
const config = require('./dbconfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const users = db.collection('users');
const tokens = db.collection('tokens');
const tycoons = db.collection('tycoons');

pingServer()
  .then(()=>{console.log('connected')})
  .catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  });

async function pingServer(){
  await client.connect();
  await db.command({ping: 1});
}

async function addUser (user){
  await pingServer();
  //TODO: encrypt password
  await users.insertOne(user);
}

async function findUser (user){
  await pingServer();
  const cursor = users.find({username: user.username});
  return await cursor.toArray();
}

async function addToken (authToken){
  await pingServer();
  await tokens.insertOne(authToken);
}

function findTokenByName(user){
  console.log('function')
}

function findTokenByAuth(authToken){
  console.log('function')
}

function removeToken(authToken) {
  console.log('function')
}

module.exports = {addUser, addToken, findUser, pingServer}