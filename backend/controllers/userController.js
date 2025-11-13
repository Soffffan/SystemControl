const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');

const userController = {
  // Получить всех пользователей
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Role,
            attributes: ['id', 'name']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      res.json({
        message: 'Пользователи получены успешно',
        users
      });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({
        error: 'Ошибка при получении пользователей',
        code: 'USERS_FETCH_ERROR'
      });
    }
  },

  // Создать нового пользователя
  async createUser(req, res) {
    try {
      const { fullName, email, password, roleId } = req.body;

      console.log('👤 Creating new user:', { fullName, email, roleId });

      // Проверяем существование пользователя
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          error: 'Пользователь с таким email уже существует',
          code: 'USER_ALREADY_EXISTS'
        });
      }

      // Проверяем существование роли
      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(400).json({
          error: 'Указанная роль не существует',
          code: 'ROLE_NOT_FOUND'
        });
      }

      // Создаем пользователя
      const user = await User.create({
        fullName,
        email,
        password,
        roleId,
        isActive: false // Новые пользователи неактивны до первого входа
      });

      // Получаем пользователя с информацией о роли (без пароля)
      const userWithRole = await User.findByPk(user.id, {
        include: [
          {
            model: Role,
            attributes: ['id', 'name']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      console.log('User created successfully:', user.email);

      res.status(201).json({
        message: 'Пользователь успешно создан',
        user: userWithRole
      });

    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        error: 'Ошибка при создании пользователя',
        code: 'USER_CREATE_ERROR',
        details: error.message
      });
    }
  },

  // Получить пользователя по ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        include: [
          {
            model: Role,
            attributes: ['id', 'name']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          error: 'Пользователь не найден',
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        message: 'Пользователь получен успешно',
        user
      });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({
        error: 'Ошибка при получении пользователя',
        code: 'USER_FETCH_ERROR'
      });
    }
  },

  // Обновить пользователя
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { fullName, email, roleId, isActive } = req.body;

      console.log('Updating user:', id, { fullName, email, roleId, isActive });

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          error: 'Пользователь не найден',
          code: 'USER_NOT_FOUND'
        });
      }

      // Проверяем email на уникальность (если меняется)
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(409).json({
            error: 'Пользователь с таким email уже существует',
            code: 'USER_ALREADY_EXISTS'
          });
        }
      }

      // Проверяем роль (если меняется)
      if (roleId) {
        const role = await Role.findByPk(roleId);
        if (!role) {
          return res.status(400).json({
            error: 'Указанная роль не существует',
            code: 'ROLE_NOT_FOUND'
          });
        }
      }

      // Обновляем пользователя
      await user.update({
        fullName: fullName || user.fullName,
        email: email || user.email,
        roleId: roleId || user.roleId,
        isActive: isActive !== undefined ? isActive : user.isActive
      });

      // Получаем обновленного пользователя с ролью
      const updatedUser = await User.findByPk(id, {
        include: [
          {
            model: Role,
            attributes: ['id', 'name']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      console.log('User updated successfully:', user.email);

      res.json({
        message: 'Пользователь успешно обновлен',
        user: updatedUser
      });

    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        error: 'Ошибка при обновлении пользователя',
        code: 'USER_UPDATE_ERROR',
        details: error.message
      });
    }
  },

  // Удалить пользователя
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      console.log('Deleting user:', id);

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          error: 'Пользователь не найден',
          code: 'USER_NOT_FOUND'
        });
      }

      // Нельзя удалить самого себя
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({
          error: 'Нельзя удалить свой собственный аккаунт',
          code: 'SELF_DELETE_NOT_ALLOWED'
        });
      }

      await user.destroy();

      console.log('User deleted successfully:', user.email);

      res.json({
        message: 'Пользователь успешно удален'
      });

    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        error: 'Ошибка при удалении пользователя',
        code: 'USER_DELETE_ERROR',
        details: error.message
      });
    }
  }
};

module.exports = userController;