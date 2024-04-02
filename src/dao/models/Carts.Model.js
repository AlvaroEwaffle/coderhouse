const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  id: { type: Number, required: false },
  products: [{
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
