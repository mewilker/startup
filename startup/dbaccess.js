const { MongoClient } = require('mongodb');
const config = require('./dbconfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const users = db.collection('users');
const tokens = db.collection('tokens');
const tycoons = db.collection('tycoons');

(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function addUser (user){

}

function findUser (user){

}

function addToken (authToken){

}

function findTokenByName(user){

}

function findTokenByAuth(authToken){

}

function removeToken(authToken) {
  
}

