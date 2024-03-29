const request = require('supertest');
const server = require('./server');

let authToken = ''

test('successful register', (done) => {
  request(server)
    .post('/user')
    .send({username: 'username', password: 'password', email: 'email'})
    .expect(response => {
        expect(response.status).toBe(200)
        const headers = response.headers;
        //expect(headers.set-cookie).toBeDefined()
        //TODO: check for a cookie
    })
    .end((err) => (err ? done(err) : done()));
});

test('bad request register', (done) => {
  request(server)
  .post('/user')
  .send({bananas: 5})
  .expect(400)
  .end((err) => (err ? done(err) : done()));
});

test('duplicate register', (done)=>{
  request(server)
  .post('/user')
  .send({username: 'username', password: 'password', email: 'email'})
  .expect(403)
  .end((err) => (err ? done (err) : done()))
})

test('register xss attack', (done)=>{
  request(server)
  .post('/user')
  .send({username: '<svg/onload=alert()>', password:'pass'})
  .expect(400)
  .end((err) => (err ? done(err): done()))
})

test('good login', (done) => {
  request(server)
  .post('/session')
  .send({username: 'username', password: 'password'})
  .expect(response => {
    expect(response.status).toBe(200)
    //TODO: check for a cookie
  })
  .end((err) => (err ? done (err) : done()))
})

test('bad password', (done) => {
  request(server)
  .post('/session')
  .send({username: 'username', password: 'bad'})
  .expect(401)
  .end((err) => (err ? done (err) : done()))
})

test('bad request login', (done) => {
  request(server)
  .post('/session')
  .send({bananas: 5})
  .expect(400)
  .end((err) => (err ? done(err) : done()));
})

test('login xss attack', (done)=>{
  request(server)
  .post('/session')
  .send({username: '<svg/onload=alert()>', password:'pass'})
  .expect(400)
  .end((err) => (err ? done(err): done()))
})

test('bad request logout', (done)=>{
  request(server)
  .delete('/session')
  .send()
  .expect(400)
  .end((err) => (err ? done(err): done()))
})




