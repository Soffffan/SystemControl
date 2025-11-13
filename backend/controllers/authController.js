const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      console.log('🔐 Attempting login for:', email);

      const user = await User.findOne({
        where: { email },
        include: [
          {
            model: Role
          }
        ]
      });

      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({
          error: 'Неверный email или пароль',
          code: 'INVALID_CREDENTIALS'
        });
      }

      console.log('User found:', user.email, 'Active:', user.isActive);

      // Проверяем пароль
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        console.log('Invalid password for:', email);
        return res.status(401).json({
          error: 'Неверный email или пароль',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Активируем при первом входе
      if (!user.isActive) {
        user.isActive = true;
        await user.save();
        console.log('User activated:', email);
      }

      // Создаем JWT токен
      const token = jwt.sign(
        { 
          userId: user.id,
          role: user.Role ? user.Role.name : 'unknown' // Используем user.Role (без алиаса)
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Убираем пароль из ответа
      const userResponse = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleId: user.roleId,
        isActive: user.isActive,
        role: user.Role ? {
          id: user.Role.id,
          name: user.Role.name
        } : null
      };

      console.log('Login successful for:', email);

      res.json({
        message: 'Вход выполнен успешно',
        token,
        user: userResponse
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Ошибка при входе в систему',
        code: 'LOGIN_ERROR',
        details: error.message
      });
    }
  },

  async getProfile(req, res) {
    try {
      // Для профиля тоже убираем алиасы
      const user = await User.findByPk(req.user.id, {
        include: [Role],
        attributes: { exclude: ['password'] }
      });

      const userResponse = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleId: user.roleId,
        isActive: user.isActive,
        role: user.Role ? {
          id: user.Role.id,
          name: user.Role.name
        } : null
      };

      res.json({
        user: userResponse
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({
        error: 'Ошибка при получении профиля',
        code: 'PROFILE_ERROR'
      });
    }
  },

  async refreshToken(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [Role],
        attributes: { exclude: ['password'] }
      });

      const userResponse = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleId: user.roleId,
        isActive: user.isActive,
        role: user.Role ? {
          id: user.Role.id,
          name: user.Role.name
        } : null
      };

      const newToken = jwt.sign(
        { 
          userId: user.id,
          role: user.Role ? user.Role.name : 'unknown'
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Токен обновлен',
        token: newToken,
        user: userResponse
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        error: 'Ошибка при обновлении токена',
        code: 'REFRESH_ERROR'
      });
    }
  }
};

module.exports = authController;