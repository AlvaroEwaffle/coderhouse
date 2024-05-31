// dao/mongo_dao/CartsDAO.js

const Cart = require('../../models/Carts.Model.js');
const Product = require('../../models/Products.Model.js');

class CartDAO {
    async createCart() {
        const newCart = new Cart();
        await newCart.save();
        return newCart;
    }


    async addProductToCart(cartId, productId, quantity) {
        quantity = Number(quantity) || 1; // Default quantity is 1 if not provided

        const cart = await Cart.findById(cartId);
        const product = await Product.findById(productId);

        if (!cart || !product) {
            throw new Error('Carrito o producto no encontrado');
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
        return cart;
    }

    async getUserCart(cartId) {
        const carts = await Cart.findById(cartId ).populate('products.product').lean();
        console.log("Found Cart",carts)
        return carts;
    }
    async deleteCart(cartId) {
        const cart = await Cart.findByIdAndDelete(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await Cart.findByIdAndUpdate(cartId, { $pull: { products: { _id: productId } } }, { new: true });
        return cart;
    }

    async updateCart(cartId, products) {
        const cart = await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findOneAndUpdate(
            { _id: cartId, 'products.productId': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );
        return cart;
    }

    async deleteProductsFromCart(cartId) {
        const cart = await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        return cart;
    }

    async getCartById(cartId) {
        console.log('DAO: ', cartId);
        try {
        const cart = await Cart.findById(cartId).populate('products.product').lean();
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        // Map over the products array to add the quantity from the cart
        return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw new Error('Error interno del servidor');
        }
    }

    async getAvailableCarts() {
        console.log('DAO: getAvailableCarts');
        const carts = await Cart.find().populate('products.product').lean();
        console.log('DAO: getAvailableCarts', carts)
        return carts;
    }
}

module.exports = new CartDAO();
