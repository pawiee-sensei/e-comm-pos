const Product = require('../models/product.model');
const Category = require('../models/category.model');

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
