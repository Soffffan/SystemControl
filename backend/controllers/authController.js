const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'role' }]
      });

      if (!user) {
        return res.status(401).json({
          error: 'Неверный email или пароль',
          code: 'INVALID_CREDENTIALS'
        });
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        console.warn(`Неудачная попытка входа для: ${email}`);
        return res.status(401).json({
          error: 'Неверный email или пароль',
          code: 'INVALID_CREDENTIALS'
        });
      }

      if (!user.isActive) {
        user.isActive = true;
        await user.save();
        console.log(`Пользователь активирован: ${email}`);
      }

      const token = jwt.sign(
        { 
          userId: user.id,
          role: user.role.name
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const userWithoutPassword = { ...user.toJSON() };
      delete userWithoutPassword.password;

      console.log(`Успешный вход: ${email}, роль: ${user.role.name}`);

      res.json({
        message: 'Вход выполнен успешно',
        token,
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Ошибка входа:', error);
      res.status(500).json({
        error: 'Ошибка при входе в систему',
        code: 'LOGIN_ERROR'
      });
    }
  },

  async getProfile(req, res) {
    try {
      res.json({
        user: req.user
      });
    } catch (error) {
      console.error('Ошибка получения профиля:', error);
      res.status(500).json({
        error: 'Ошибка при получении профиля',
        code: 'PROFILE_ERROR'
      });
    }
  },

  async refreshToken(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{ model: Role, as: 'role' }],
        attributes: { exclude: ['password'] }
      });

      const newToken = jwt.sign(
        { 
          userId: user.id,
          role: user.role.name
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Токен обновлен',
        token: newToken,
        user
      });

    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      res.status(500).json({
        error: 'Ошибка при обновлении токена',
        code: 'REFRESH_ERROR'
      });
    }
  }
};

module.exports = authController;