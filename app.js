require('dotenv').config();

const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

/* =========================
   HELMET + CSP (STABLE)
========================= */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:"]
      }
    }
  })
);

/* =========================
   CORE MIDDLEWARE
========================= */
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* =========================
   SESSION CONFIG
========================= */
app.use(
  session({
    name: 'ecom.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);

/* =========================
   STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   VIEW ENGINE
========================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* =========================
   ROUTES — USER SIDE
   (PUBLIC / CUSTOMER)
========================= */
const authRoutes = require('./routes/user.auth.routes');
const shopRoutes = require('./routes/shop.routes');
const cartRoutes = require('./routes/cart.routes');

app.use('/', authRoutes);   // /login /register /logout (USER)
app.use('/', shopRoutes);   // /shop /shop/checkout
app.use('/', cartRoutes);   // /cart

/* =========================
   ROUTES — ADMIN SIDE
   (STRICTLY /admin)
========================= */
const adminRoutes = require('./routes/admin.routes');
const adminProductRoutes = require('./routes/admin.products.routes');
const adminCategoryRoutes = require('./routes/admin.categories.routes');

app.use('/admin', adminRoutes);
app.use('/admin', adminProductRoutes);
app.use('/admin', adminCategoryRoutes);

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
