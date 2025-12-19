const router = require('express').Router();
const Product = require('../models/product.model');

/* =========================
   VIEW CART
========================= */
router.get('/cart', (req, res) => {
  const cart = req.session.cart || {};
  const items = Object.values(cart);

  res.render('shop/cart', {
    title: 'Your Cart',
    items
  });
});

/* =========================
   ADD TO CART
========================= */
router.post('/cart/add/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/shop');

  if (!req.session.cart) {
    req.session.cart = {};
  }

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
   REMOVE ITEM
========================= */
router.post('/cart/remove/:id', (req, res) => {
  if (req.session.cart) {
    delete req.session.cart[req.params.id];
  }
  res.redirect('/cart');
});

module.exports = router;
