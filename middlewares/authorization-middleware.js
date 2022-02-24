const { Todo } = require('../models/index');

async function authorizationMiddleware(req, res, next) {
  const { id } = req.params
  try{
    const todo = await Todo.findByPk(id);
    if (!todo) throw { name: 'NotFound' };
    if (todo.UserId != req.user.id) throw { name: 'NotAuthorized'}
    next()
  }catch(error){
    next(error)
  }
}

module.exports = authorizationMiddleware;