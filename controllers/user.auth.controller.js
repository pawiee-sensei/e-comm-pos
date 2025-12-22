const bcrypt = require('bcrypt');
const User = require('../models/user.model');

/* =========================
   SHOW SIGNUP
========================= */
exports.showSignup = (req, res) => {
  res.render('auth/signup', {
    title: 'Sign Up',
    error: null
  });
};

/* =========================
   HANDLE SIGNUP
   (NO AUTO-LOGIN)
========================= */
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.render('auth/signup', {
      title: 'Sign Up',
      error: 'All fields are required'
    });
  }

  const existing = await User.findByEmail(email);
  if (existing) {
    return res.render('auth/signup', {
      title: 'Sign Up',
      error: 'Email already registered'
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashed
  });

  // ✅ AFTER SIGNUP → GO TO LOGIN
  // (cleaner, predictable flow)
  res.redirect('/user/login');
};

/* =========================
   SHOW LOGIN
========================= */
exports.showLogin = (req, res) => {
  res.render('auth/userLogin', {
    title: 'Login',
    error: null
  });
};

/* =========================
   HANDLE LOGIN
========================= */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return res.render('auth/userLogin', {
      title: 'Login',
      error: 'Invalid email or password'
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.render('auth/userLogin', {
      title: 'Login',
      error: 'Invalid email or password'
    });
  }

  // ✅ LOGIN SUCCESS
  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  // 🔑 READ REDIRECT HERE
  const redirectTo = req.session.redirectAfterLogin || '/shop';

  // 🧹 CLEANUP
  delete req.session.redirectAfterLogin;

  // 🚀 SEND USER WHERE THEY INTENDED TO GO
  res.redirect(redirectTo);
};

/* =========================
   LOGOUT
========================= */
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/shop');
  });
};
