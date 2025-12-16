const Product = require('../models/product.model');
const { v4: uuid } = require('uuid');

exports.renderPanel = (req, res) => {
  res.render('admin/products', { user: req.session.user });
};

exports.list = async (req, res) => {
  const { search = '', page = 1 } = req.query;
  const limit = 10;
  const offset = (page - 1) * limit;

  const items = await Product.getAll({
    search,
    limit,
    offset
  });

  const total = await Product.countAll({ search });

  res.json({
    items,
    total,
    page,
    pages: Math.ceil(total / limit)
  });
};

exports.create = async (req, res) => {
  const { name, sku, price, description, category_id } = req.body;

  await Product.create([
    uuid(),
    name,
    sku,
    description,
    price,
    category_id || null,
    req.file ? req.file.filename : null
  ]);

  res.json({ success: true });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category_id } = req.body;

  await Product.update(id, [
    name,
    description,
    price,
    category_id || null,
    req.file ? req.file.filename : null
  ]);

  res.json({ success: true });
};

exports.remove = async (req, res) => {
  await Product.remove(req.params.id);
  res.json({ success: true });
};
