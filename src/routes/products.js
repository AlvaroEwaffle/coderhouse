const express = require('express');
const router = express.Router();
const passport = require('passport');

// Controladores
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../dao/mongodb/products.js');

// Rutas
router.get('/', getAllProducts);
router.get('/:pid', getProductById);
router.post('/', createProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);


module.exports = router;
