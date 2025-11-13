const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { validateCreateUser, validateUpdateUser } = require('../middleware/userValidation');

// Все роуты требуют аутентификации и прав менеджера
router.use(auth);
router.use(roleCheck(['manager']));

// GET /api/users - Получить всех пользователей
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Получить пользователя по ID
router.get('/:id', userController.getUserById);

// POST /api/users - Создать нового пользователя
router.post('/', validateCreateUser, userController.createUser);

// PUT /api/users/:id - Обновить пользователя
router.put('/:id', validateUpdateUser, userController.updateUser);

// DELETE /api/users/:id - Удалить пользователя
router.delete('/:id', userController.deleteUser);

module.exports = router;