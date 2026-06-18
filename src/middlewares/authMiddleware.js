exports.isAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.session.user.role !== 'admin') {
    return res.send('Accès refusé');
  }
  next();
};