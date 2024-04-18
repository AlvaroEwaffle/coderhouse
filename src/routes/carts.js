const express = require('express');
const router = express.Router();

// Controladores
const {
  createCart,
  getCartById,
  addProductToCart,
  getAvailableCarts,
  deleteCart,
  deleteProductFromCart,
  updateCart,
  deleteProductsfromCart,
} = require('../dao/mongodb/carts.js');

// Rutas
router.get('/', getAvailableCarts);
router.get('/:cid', getCartById);
router.post('/', createCart);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/', deleteCart);
router.delete('/:cid/product/:pid',deleteProductFromCart)
router.put('api/carts/:cid',updateCart)
router.delete('/:cid',deleteProductsfromCart)

module.exports = router;
