const Cart = require('../models/Carts.Model.js');

// Controladores
exports.createCart = async (req, res) => {
    try {
        const carts = await Cart.find();
        const newCart = new Cart({
            products: []
        });
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            res.status(404).json({ message: 'Carrito no encontrado' });
        } else {
            res.json(cart);
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
            //const product = await Product.findById(req.params.pid);
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        
        const existingProductIndex = cart.products.findIndex(item => item.productId === productId);
        console.log(existingProductIndex);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            console.log(productId);
            cart.products.push({ productId, quantity });
        }
        
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.getAvailableCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.json(carts);
    } catch (error) {
        console.error('Error al obtener los carritos disponibles:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//Delete Cart
exports.deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error al eliminar el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
