const express = require('express');
const router = express.Router();
const CartService = require('../services/CartsService');
const passport = require('passport');

// Rutas
router.get('/',  CartService.getUserCart);
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), CartService.purchaseCart);
//router.get('/', CartService.getAvailableCarts);
router.get('/:cid', CartService.getCartById);
router.post('/', CartService.createCart);
router.post('/:cid/product/:pid', CartService.addProductToCart);
router.delete('/:cid/', CartService.deleteCart);
router.delete('/:cid/product/:pid',CartService.deleteProductFromCart)
router.put('api/carts/:cid',CartService.updateCart)
router.delete('/:cid',CartService.deleteProductFromCart)


module.exports = router;
