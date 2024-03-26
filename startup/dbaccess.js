const { MongoClient, Collection } = require('mongodb');
const config = require('./dbconfig.json');
let Tycoon = undefined;
import ('./public/tycoon.mjs').then((module)=> {
  Tycoon = module.default;
  console.log('tycoon package imported')
});

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
  await users.insertOne(user);
}

async function findUser (user){
  const cursor = users.find({username: user.username});
  let result = await cursor.toArray();
  return result;
}

async function addToken (authToken){
  await tokens.insertOne(authToken);
}

function findTokenByName(user){
  //TODO: impl?
  console.log('function')
}

async function findTokenByAuth(authToken){
  //TODO: validate authToken to protect against injection attacks
  const cursor = tokens.find({token: authToken});
  let result = await cursor.toArray();
  return result;
}

function removeToken(authToken) {
  tokens.deleteOne(authToken);
}

async function findTycoon(user) {
  const cursor = tycoons.find({user:user});
  let result = await cursor.toArray();
  if (result.length > 0){
    let found = result[0];
    found._id = undefined
    //can we change the design so we don't have to do this?
    found.user = undefined
    return JSON.stringify(found);
  }
  let tycoon = new Tycoon(user);
  let toinsert = JSON.parse(tycoon.tojson());
  toinsert.user = user;
  tycoons.insertOne(toinsert);
  return tycoon.tojson();
}

async function updateTycoon(user, tycoon){
  const cursor = tycoons.find({user:user});
  let result = await cursor.toArray();
  if (result.length > 0){
    let found = result[0];
    //can we change the design so we don't have to do this?
    tycoons.updateOne({user:user},{$set: tycoon})
    return JSON.stringify(found);
  }
  else {
    throw new Error('unauthorized')
  }
}

async function getScores(){
  const cursor = tycoons.find({}, {sort:{money:-1},projection:{user:1, money:1, _id:0}});
  return await cursor.toArray();
}

process.on('SIGINT', function() {
  client.close(true);
  console.log('Mongo disconnected on app termination');
  process.exit(0);
});

module.exports = {addUser, addToken, findUser, pingServer, 
  closeConnection, findTokenByAuth, removeToken, findTycoon, 
  updateTycoon, getScores}