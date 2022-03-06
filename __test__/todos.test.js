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
  {
    username: 'yusup2',
    email: 'yusup+1@softwareseni.com',
    password: hash('123456'),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]


const dateNow = new Date()
const nextweek = new Date(
  dateNow.getFullYear(),
  dateNow.getMonth(),
  dateNow.getDate() + 7,
)

const lastweek = new Date(
  dateNow.getFullYear(),
  dateNow.getMonth(),
  dateNow.getDate() - 7,
)

const todos = [
  {
    title: 'Todo list1',
    description: 'Example Todo List 1111',
    UserId: 1,
    due_date: nextweek,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Todo list2',
    description: 'Example Todo List 2222',
    UserId: 1,
    due_date: nextweek,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const newTodo = {
  title: 'New Todo List',
  description: 'New todo list new new new',
  UserId: 1,
  due_date: nextweek,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const access_token = {
  token1: '',
  token2: '',
}

beforeAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  })
  await queryInterface.bulkInsert('Users', users)
  access_token.token1 = sign({ id: 1, email: users[0].email })
  access_token.token2 = sign({ id: 2, email: users[1].email })

  await queryInterface.bulkDelete('Todos', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  })
  await queryInterface.bulkInsert('Todos', todos)
})

describe('Get all todos tests', () => {
  test('successful get all todos', async () => {
    const { body } = await request(app)
      .get('/todos')
      .set('access_token', access_token.token1)
      .expect(200)

    expect(body.length).toBe(todos.length)
    expect(body).toEqual(expect.arrayContaining(
      [
        expect.objectContaining({
          title: todos[0].title,
          description: todos[0].description,
          UserId: todos[0].UserId,
        })
      ]
    ))
    expect(body).toEqual(expect.arrayContaining(
      [
        expect.objectContaining({
          title: todos[1].title,
          description: todos[1].description,
          UserId: todos[1].UserId,
        })
      ]
    ))
  })

  test('unsuccessful get all todos', async () => {
    const { body } = await request(app)
      .get('/todos')
      .expect(401)

    expect(body).toEqual({ message: 'no access_token provided' })
  })
})

describe('GetOneTodoByID tests', () => {
  test('successful get one todo', async () => {
    const { body } = await request(app)
      .get('/todos/1')
      .set('access_token', access_token.token1)
      .expect(200)

    expect(body).toEqual(
      expect.objectContaining({
        title: todos[0].title,
        description: todos[0].description,
        UserId: todos[0].UserId,
      })
    )
    expect(body.User).toEqual(
      expect.objectContaining({
        username: users[0].username,
        email: users[0].email,
      })
    )
  })

  test('unsuccessful get one todo', async () => {
    const { body } = await request(app)
      .get('/todos/1')
      .expect(401)
    expect(body).toEqual({ message: 'no access_token provided' })
  })

  test('unsuccessful get one todo - not found', async () => {
    const { body } = await request(app)
      .get('/todos/9')
      .set('access_token', access_token.token1)
      .expect(404)
    expect(body).toEqual({ message: 'not found' })
  })

  test('unsuccessful get one todo - not found', async () => {
    const { body } = await request(app)
      .get('/todos/9')
      .set('access_token', access_token.token1)
      .expect(404)
    expect(body).toEqual({ message: 'not found' })
  })

  test('unsuccessful get one todo because not the creator', async () => {
    const { body } = await request(app)
      .get('/todos/1')
      .set('access_token', access_token.token2)
      .expect(403)
    expect(body).toEqual({ message: 'You not authorize to do this action' })
  })
})

describe('CreateTodo tests', () => {
  test('successful create a todo', async () => {
    const { body } = await request(app)
      .post('/todos')
      .set('access_token', access_token.token1)
      .send(newTodo)
      .expect(201)

    expect(body).toEqual(
      expect.objectContaining({
        title: newTodo.title,
        description: newTodo.description,
        UserId: newTodo.UserId,
      })
    )
    expect(body.UserId).toBe(1)
  })

  test('unsuccessful create a todo', async () => {
    const { body } = await request(app)
      .post('/todos')
      .expect(401)
    expect(body).toEqual({ message: 'no access_token provided' })
  })

  test('unsuccessful create a todo with empty title', async () => {
    const { body } = await request(app)
      .post('/todos')
      .set('access_token', access_token.token1)
      .send({
        ...newTodo,
        title: ""
      })
      .expect(400)
    expect(body).toEqual({ message: "title cannot be empty" })
  })

  test('unsuccessful create a todo with empty description', async () => {
    const { body } = await request(app)
      .post('/todos')
      .set('access_token', access_token.token1)
      .send({
        ...newTodo,
        description: ""
      })
      .expect(400)
    expect(body).toEqual({ message: "description cannot be empty" })
  })

  test('unsuccessful create a todo with empty due_date', async () => {
    const { body } = await request(app)
      .post('/todos')
      .set('access_token', access_token.token1)
      .send({
        ...newTodo,
        due_date: ""
      })
      .expect(400)
    expect(body).toEqual({ message: "due date can't be empty" })
  })

  test('unsuccessful create a todo with past due_date', async () => {
    const { body } = await request(app)
      .post('/todos')
      .set('access_token', access_token.token1)
      .send({
        ...newTodo,
        due_date: lastweek
      })
      .expect(400)
    expect(body).toEqual({ message: "due date can't before today" })
  })

})