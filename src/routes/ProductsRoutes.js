// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const ProductService = require('../services/ProductService');

// Define the routes and use ProductService to handle requests
router.get('/', async (req, res) => {
  try {
    const products = await ProductService.getProducts(req.query);
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.pid);
    res.json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await ProductService.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al agregar un producto:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const updateData = req.body;
    const updatedProduct = await ProductService.updateProduct(req.params.pid, updateData);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const response = await ProductService.deleteProduct(req.params.pid);
    res.json(response);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
