const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  thumbnails: [{ type: String }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
