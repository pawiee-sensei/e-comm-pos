require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

/* Helmet + CSP (STABLE BASELINE) */
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

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Sessions */
app.use(
  session({
    name: 'ecom.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

/* Views */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Routes */
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
