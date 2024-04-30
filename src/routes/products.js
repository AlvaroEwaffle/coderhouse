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
router.get('/', ensureAuthenticated, getAllProducts);
router.get('/:pid', ensureAuthenticated, getProductById);
router.post('/',ensureAuthenticated, createProduct);
router.put('/:pid',ensureAuthenticated, updateProduct);
router.delete('/:pid',ensureAuthenticated, deleteProduct);

function ensureAuthenticated(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log("Autenticado")
      return next();
  }
  console.log("No Autenticado", req)
  res.send('User not autenticated');
}


module.exports = router;
