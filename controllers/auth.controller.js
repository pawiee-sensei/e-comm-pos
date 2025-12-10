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

  req.session.user = {
    id: user.id,
    name: user.name,
    role: user.role
  };

  return res.redirect('/');
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
