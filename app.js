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
    saveUninitialized: false
  })
);

/* =========================
   STATIC FILES
   Required for:
   /public/js/*
   /public/css/*
   ========================= */
app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   VIEW ENGINE
   ========================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* =========================
   ROUTES
   ========================= */
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');


app.use('/', authRoutes);
app.use('/', adminRoutes);

const adminProductRoutes = require('./routes/admin.products.routes');
app.use('/', adminProductRoutes);


/* =========================
   SERVER
   ========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});