const authorizationMiddleware = require('../middlewares/authorization-middleware');
const TodosController = require('./../controllers/todos-controller');
const router = require('express').Router();

// GET /todos/:id
router.get('/:id', authorizationMiddleware, TodosController.findById);

// GET /todos
router.get('/', TodosController.findAll);

// POST /photos
router.post('/', TodosController.insertTodo);

// DELETE /photos/:id
router.delete('/:id', authorizationMiddleware, TodosController.deleteTodo);

// PUT /photos/:id
router.put('/:id', authorizationMiddleware, TodosController.updateTodo);

module.exports = router;