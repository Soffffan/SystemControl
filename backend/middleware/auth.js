const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Требуется аутентификация',
        code: 'AUTH_REQUIRED'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      include: [Role],
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Пользователь не найден',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Учетная запись не активирована',
        code: 'USER_INACTIVE'
      });
    }

    req.user = {
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

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Неверный токен',
        code: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Токен истек',
        code: 'TOKEN_EXPIRED'
      });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Ошибка аутентификации',
      code: 'AUTH_ERROR'
    });
  }
};

module.exports = auth;