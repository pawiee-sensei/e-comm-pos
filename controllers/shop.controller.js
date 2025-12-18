const Product = require('../models/product.model');

exports.index = async (req, res) => {
  const items = await Product.getAll({
    search: '',
    limit: 24,
    offset: 0
  });

  res.render('shop/index', {
    title: 'Shop',
    products: items
  });
};
