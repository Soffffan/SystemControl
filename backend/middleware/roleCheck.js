const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role.name)) {
      return res.status(403).json({ 
        error: 'Недостаточно прав для выполнения операции',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  };
};

module.exports = roleCheck;