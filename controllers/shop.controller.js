const Product = require('../models/product.model');
const Category = require('../models/category.model');

/* =========================
   SHOP PAGE
========================= */
exports.index = async (req, res) => {
  const q = (req.query.q || '').trim();
  const category = req.query.category || null;

  const products = await Product.getAll({
    search: q,
    category,
    limit: 24,
    offset: 0
  });

  const categories = await Category.getAll();

  res.render('shop/index', {
    title: 'Shop',
    products,
    categories,
    q,
    activeCategory: category,
    session: req.session
  });
};

/* =========================
   CHECKOUT PAGE (SAFE)
========================= */
exports.checkout = (req, res) => {
  // Cart stored as object: { productId: { id, name, price, qty, ... } }
  const cartObj = req.session.cart || {};

  // Convert object → array for rendering
  const cart = Object.values(cartObj);

  const total = cart.reduce(
    (sum, item) => sum + (item.price * item.qty),
    0
  );

  res.render('shop/checkout', {
    title: 'Checkout',
    cart,
    total,
    session: req.session
  });
};
/* =========================
   UPDATE CART QUANTITIES
========================= */
exports.updateCart = (req, res) => {
  // Cart stored as object
  const cartObj = req.session.cart || {};
  const qtyMap = req.body.qty || {};

  Object.keys(qtyMap).forEach(productId => {
    if (cartObj[productId]) {
      const qty = parseInt(qtyMap[productId], 10);

      // Enforce minimum quantity = 1
      cartObj[productId].qty = isNaN(qty) || qty < 1 ? 1 : qty;
    }
  });

  req.session.cart = cartObj;

  res.redirect('/shop/checkout');
};
