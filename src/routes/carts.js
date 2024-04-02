const express = require('express');
const router = express.Router();

// Controladores
const {
  createCart,
  getCartById,
  addProductToCart,
  getAvailableCarts
} = require('../dao/mongodb/carts.js');

// Rutas
router.get('/', getAvailableCarts);
router.get('/:cid', getCartById);
router.post('/', createCart);
router.post('/:cid/product/:pid', addProductToCart);

module.exports = router;
