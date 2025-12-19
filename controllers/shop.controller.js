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
