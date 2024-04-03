const express = require('express');
const router = express.Router();

// Controladores
const {
  createCart,
  getCartById,
  addProductToCart,
  getAvailableCarts,
  deleteCart
} = require('../dao/mongodb/carts.js');

// Rutas
router.get('/', getAvailableCarts);
router.get('/:cid', getCartById);
router.post('/', createCart);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/', deleteCart);

module.exports = router;
