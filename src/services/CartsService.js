// controllers/cartController.js
const CartService = require('../repositories/CartRepository');

exports.createCart = async (req, res) => {
    try {
        const newCart = await CartService.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getCartById = async (req, res) => {
    const cartId  = req.params.cid;
    console.log (req.params)
    console.log(cartId)

    try {
        const cart = await CartService.getCartById(cartId);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error getting cart by id:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getUserCart = async (req, res) => {
    console.log(req.user)

    try {
        const cart = await CartService.getUserCart(req.user.cart);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error getting user cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.purchaseCart = async (req, res) => {
    try {
        const purchaseResult = await CartService.purchaseCart(req);
        res.status(200).json(purchaseResult);
    } catch (error) {
        console.error('Error purchasing cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const { cartId, productId, quantity } = req.params;
        const updatedCart = await CartService.addProductToCart(cartId, productId, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAvailableCarts = async (req, res) => {
    try {
        const carts = await CartService.getAvailableCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error('Error getting available carts:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const deletedCart = await CartService.deleteCart(cartId);
        res.status(200).json(deletedCart);
    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteProductFromCart = async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const updatedCart = await CartService.deleteProductFromCart(cartId, productId);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { products } = req.body;
        const updatedCart = await CartService.updateCart(cartId, products);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateProductQuantity = async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        const updatedCart = await CartService.updateProductQuantity(cartId, productId, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error updating product quantity in cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteProductsFromCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const updatedCart = await CartService.deleteProductsFromCart(cartId);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error deleting all products from cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
