const Product = require('../models/product.model');
const { v4: uuid } = require('uuid');
const { generateSKU } = require('../utils/sku.util');

/* =========================
   RENDER PRODUCTS PANEL
========================= */
exports.renderPanel = (req, res) => {
  res.render('admin/products', {
    user: req.session.user
  });
};

/* =========================
   LIST PRODUCTS (API)
========================= */
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

/* =========================
   GET SINGLE PRODUCT
========================= */
exports.getOne = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
};

/* =========================
   CREATE PRODUCT
========================= */
exports.create = async (req, res) => {
  const { name, price, description, category_id, stock } = req.body;

  const sku = generateSKU();
  const initialStock = Number.isInteger(Number(stock)) ? Number(stock) : 0;

  await Product.create([
    uuid(),
    name,
    sku,
    description,
    price,
    category_id || null,
    req.file ? req.file.filename : null,
    initialStock
  ]);

  res.json({ success: true });
};

/* =========================
   UPDATE PRODUCT (FIXED)
========================= */
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category_id } = req.body;

  const affected = await Product.update(id, {
    name,
    description,
    price,
    category_id: category_id || null,
    image: req.file ? req.file.filename : undefined // 🔑 KEY FIX
  });

  if (!affected) {
    return res.status(400).json({
      error: 'Update failed or no changes applied'
    });
  }

  res.json({ success: true });
};

/* =========================
   DELETE PRODUCT
========================= */
exports.remove = async (req, res) => {
  await Product.remove(req.params.id);
  res.json({ success: true });
};
