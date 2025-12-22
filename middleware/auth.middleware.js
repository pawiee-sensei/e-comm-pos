function ensureAuthenticated(req, res, next) {
  if (!req.session.user) {
    req.session.redirectAfterLogin = req.originalUrl;

    return res.redirect('/user/login');
  }
  next();
}



function ensureAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/admin/login');
  }
  next();
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin
};
