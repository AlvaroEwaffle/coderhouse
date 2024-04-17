const Cart = require('../models/Carts.Model.js');
const Product = require('../models/Products.Model.js');
const ObjectId = require('mongoose').Types.ObjectId;

// Controladores
exports.createCart = async (req, res) => {
    try {
        const newCart = new Cart();
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// GET /api/carts/:cid to retrieve a cart by ID and populate the products
exports.getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
        if (!cart) {
            res.status(404).json({ message: 'Carrito no encontrado' });
        } else {
            // Map over the products array to add the quantity from the cart
            const populatedCart = {
                _id: cart._id,
                __v: cart.__v,
                products: cart.products.map(item => ({
                    ...item.product,
                    quantity: item.quantity
                }))
            };
            res.json(populatedCart);
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


//FIX
exports.addProductToCart = async (req, res) => {
    try {
        let quantity = req.body.quantity || 1; // Default quantity is 1 if not provided
        //validate if quantity is a number or transform to it 
        if (typeof quantity !== 'number') {
            //transform quantity to number
            quantity = Number(quantity);
        }
        const cart = await Cart.findById(req.params.cid);
        const product = await Product.findById(req.params.pid);

        if (!cart || !product) {
            return res.status(404).json({ message: 'Carrito o producto no encontrado' });
        }

        // Check if the product is already in the cart
        const existingProduct = cart.products.find(item => item.product.equals(product._id));

        if (existingProduct) {
            // If the product is already in the cart, update the quantity
            existingProduct.quantity += quantity;
        } else {
            // If the product is not in the cart, add it with the quantity
            cart.products.push({
                product: product._id,
                quantity: quantity
            });
        }

        // Save the updated cart
        await cart.save();

        // Respond with the updated cart
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


exports.getAvailableCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products');
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
//NEW ENDPOINTS
// DELETE /api/carts/:cid/products/:pid to delete a product from the cart
exports.deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findByIdAndUpdate(cid, { $pull: { products: { productId: pid } } }, { new: true });
        res.json(cart);
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PUT /api/carts/:cid to update the cart with a new array of products
exports.updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
        res.json(cart);
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PUT /api/carts/:cid/products/:pid to update the quantity of a product in the cart
exports.updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findOneAndUpdate(
            { _id: cid, 'products.productId': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );
        res.json(cart);
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// DELETE /api/carts/:cid to delete all products from the cart
exports.deleteProductsfromCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
        res.json(cart);
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};