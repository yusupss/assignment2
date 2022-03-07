const request = require('supertest')
const app = require('../index')
const { hash } = require('../helpers/hash-helper')
const { sign } = require('../helpers/jwt-helper')
const { queryInterface } = require('../models/index').sequelize

const users = [
  {
    username: 'yusup',
    email: 'yusup@softwareseni.com',
    password: hash('123456'),
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

const newUser = {
  username: 'yusupNew1',
  email: 'yusup+1@softwareseni.com',
  password: hash('123456'),
  createdAt: new Date(),
  updatedAt: new Date()
}

const access_token = {
  token: '',
}

beforeAll((done) => {
  queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  })
    .then(() => {
      return queryInterface.bulkInsert('Users', users)
    })
    .then(() => {
      access_token.token = sign({ id: 1, email: users[0].email })
      done();
    })
    .catch((error) => {
      console.log(error)
      done(error)
    })
})

describe('register tests', () => {
  test('successful registration', async () => {
    const { body } = await request(app)
      .post('/register')
      .send(newUser)
      .expect(201)

    expect(body).toEqual({
        id: expect.any(Number),
        username: newUser.username,
        email: newUser.email
      })
  })

  test('unsuccessful registration because of username is blank', async () => {
    const customUser = {
      username: "",
      email: 'yusup+1@softwareseni.com',
      password: hash('123456'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const { body } = await request(app)
      .post('/register')
      // .set('access_token', access_token.token)
      .send(customUser)
      .expect(400)
    expect(body).toEqual({ message: "username cannot be empty" })
  })

  test('unsuccessful registration because of wrong email format', async () => {
    const customUser = {
      ...newUser,
      email: 'useraddgmailcom',
    };
    const { body } = await request(app)
      .post('/register')
      // .set('access_token', access_token.token)
      .send(customUser)
      .expect(400)
    expect(body).toEqual({ message: 'wrong email format' });
  })

  test('unsuccessful registration because of password is less than 8 characters', async () => {
    const customUser = {
      ...newUser,
      password: 'pass',
    };
    const { body } = await request(app)
      .post('/register')
      // .set('access_token', access_token.token)
      .send(customUser)
      .expect(400)
    expect(body).toEqual({ message: 'password cannot be less than five characters' });
  })

})