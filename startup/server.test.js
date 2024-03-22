const request = require('supertest');
const server = require('./server');

let authToken = ''

test('successful register', (done) => {
  request(server)
    .post('/user')
    .send({username: 'username', password: 'password', email: 'email'})
    .expect(response => {
        expect(response.status).toBe(200)
        console.log(response.header);
        //TODO: check for a cookie
        //front end currently depends on date
        done();
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
});




