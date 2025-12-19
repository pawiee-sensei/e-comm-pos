const Category = require('../models/category.model');

/* LIST */
exports.list = async (req, res) => {
  const items = await Category.getAll();
  res.json({ items });
};

/* CREATE */
exports.create = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  await Category.create(name.trim());
  res.json({ success: true });
};

/* UPDATE */
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const affected = await Category.update(id, name.trim());
  if (!affected) return res.status(404).json({ error: 'Not found' });

  res.json({ success: true });
};

/* DELETE */
exports.remove = async (req, res) => {
  await Category.remove(req.params.id);
  res.json({ success: true });
};
