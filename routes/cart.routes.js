const router = require('express').Router();
const Product = require('../models/product.model');

/* =========================
   VIEW CART
========================= */
router.get('/cart', (req, res) => {
  const cart = req.session.cart || {};
  const items = Object.values(cart);

  const total = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  res.render('shop/cart', {
    title: 'Your Cart',
    items,
    total,
    session: req.session
  });
});

/* =========================
   ADD TO CART
========================= */
router.post('/cart/add/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/shop');

  if (!req.session.cart) req.session.cart = {};

  const cart = req.session.cart;

  if (!cart[product.id]) {
    cart[product.id] = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    };
  } else {
    cart[product.id].qty += 1;
  }

  res.redirect('/shop');
});

/* =========================
   INCREASE QTY
========================= */
router.post('/cart/increase', (req, res) => {
  const { id } = req.body;
  const cart = req.session.cart;

  if (cart && cart[id]) {
    cart[id].qty += 1;
  }

  res.redirect('/cart');
});

/* =========================
   DECREASE QTY
========================= */
router.post('/cart/decrease', (req, res) => {
  const { id } = req.body;
  const cart = req.session.cart;

  if (cart && cart[id]) {
    cart[id].qty -= 1;
    if (cart[id].qty <= 0) {
      delete cart[id];
    }
  }

  res.redirect('/cart');
});

/* =========================
   REMOVE ITEM
========================= */
router.post('/cart/remove', (req, res) => {
  const { id } = req.body;

  if (req.session.cart && req.session.cart[id]) {
    delete req.session.cart[id];
  }

  res.redirect('/cart');
});

/* =========================
   CHECKOUT GATE (CRITICAL)
========================= */
router.post('/cart/checkout', (req, res) => {
  if (!req.session.user) {
    req.session.checkoutBlocked = true;
    return res.redirect('/cart');
  }

  res.redirect('/shop/checkout');
});

/* =========================
   CHECKOUT PAGE (GET)
========================= */
router.get('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/cart');
  }

  const cart = req.session.cart || {};
  const items = Object.values(cart);

  if (items.length === 0) {
    return res.redirect('/shop');
  }

  const total = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  res.render('shop/checkout', {
    title: 'Checkout',
    items,
    total,
    session: req.session
  });
});

module.exports = router;
