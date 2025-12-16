function generateSKU() {
  const date = new Date();

  const ymd =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');

  const random = Math.floor(10000 + Math.random() * 90000);

  return `SKU-${ymd}-${random}`;
}

module.exports = { generateSKU };
