const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

async function showLogin(req, res) {
  res.render('auth/login');
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return res.render('auth/login', { error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.render('auth/login', { error: 'Invalid credentials' });
  }

  // Save user session
  req.session.user = {
    id: user.id,
    name: user.name,
    role: user.role
  };

  // ✅ Redirect-back logic (SAFE)
  const redirectAfterLogin = req.session.redirectAfterLogin;
  delete req.session.redirectAfterLogin;

  // Admin always goes to admin
  if (user.role === 'admin') {
    return res.redirect('/admin');
  }

  // User goes back to intended page OR fallback
  return res.redirect(redirectAfterLogin || '/shop');
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/login');
  });
}

module.exports = {
  showLogin,
  login,
  logout
};
