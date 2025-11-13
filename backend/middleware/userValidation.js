const { body, validationResult } = require('express-validator');

// Валидация создания пользователя
const validateCreateUser = [
  body('fullName')
    .isLength({ min: 2 })
    .withMessage('Имя должно быть не менее 2 символов')
    .trim()
    .escape(),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Введите корректный email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть не менее 6 символов')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Пароль должен содержать хотя бы одну заглавную букву, одну строчную и одну цифру'),

  body('roleId')
    .isInt({ min: 1 })
    .withMessage('Укажите корректную роль'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Ошибка валидации',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }
    next();
  }
];

// Валидация обновления пользователя
const validateUpdateUser = [
  body('fullName')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Имя должно быть не менее 2 символов')
    .trim()
    .escape(),

  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Введите корректный email'),

  body('roleId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Укажите корректную роль'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Статус должен быть true или false'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Ошибка валидации',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }
    next();
  }
];

module.exports = {
  validateCreateUser,
  validateUpdateUser
};