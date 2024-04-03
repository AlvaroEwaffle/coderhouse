const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  id: { type: String, required: false },
  products: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true }
  }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
