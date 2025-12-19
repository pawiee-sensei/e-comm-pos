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
   UPDATE QTY
========================= */
router.post('/cart/update/:id', (req, res) => {
  const { action } = req.body;
  const cart = req.session.cart;

  if (!cart || !cart[req.params.id]) {
    return res.redirect('/cart');
  }

  if (action === 'inc') {
    cart[req.params.id].qty += 1;
  }

  if (action === 'dec') {
    cart[req.params.id].qty -= 1;
    if (cart[req.params.id].qty <= 0) {
      delete cart[req.params.id];
    }
  }

  res.redirect('/cart');
});

/* =========================
   REMOVE ITEM
========================= */
router.post('/cart/remove/:id', (req, res) => {
  if (req.session.cart) {
    delete req.session.cart[req.params.id];
  }
  res.redirect('/cart');
});

/* =========================
   CHECKOUT PAGE
========================= */
router.get('/checkout', (req, res) => {
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
