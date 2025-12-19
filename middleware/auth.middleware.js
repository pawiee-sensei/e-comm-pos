function ensureAuthenticated(req, res, next) {
  if (!req.session.user) {
    // Save intended destination for user-side pages
    req.session.redirectAfterLogin = req.originalUrl;
    return res.redirect('/login');
  }
  next();
}

function ensureAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }
  next();
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin
};
