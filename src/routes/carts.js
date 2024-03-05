const express = require('express');
const router = express.Router();

// Controladores
const {
  createCart,
  getCartById,
  addProductToCart,
  getAvailableCarts
} = require('../controllers/carts');

// Rutas
router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.get('/', getAvailableCarts);

module.exports = router;
