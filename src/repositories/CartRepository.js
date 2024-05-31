// repositories/CartRepository.js

const CartDAO = require('../dao/mongo_dao/CartsDAO');

class CartRepository {
    constructor() {
        this.cartDAO = CartDAO;
    }

    async createCart() {
        return await this.cartDAO.createCart();
    }

    async getCartById(cartId) {
        return await this.cartDAO.getCartById(cartId);
    }


    async getUserCart(cartId) {
        return await this.cartDAO.getUserCart(cartId);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await this.cartDAO.addProductToCart(cartId, productId, quantity);
    }

    async getAvailableCarts() {
        console.log('Repository: getAvailableCarts');
        return await this.cartDAO.getAvailableCarts();
    }

    async deleteCart(cartId) {
        return await this.cartDAO.deleteCart(cartId);
    }

    async deleteProductFromCart(cartId, productId) {
        return await this.cartDAO.deleteProductFromCart(cartId, productId);
    }

    async updateCart(cartId, products) {
        return await this.cartDAO.updateCart(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await this.cartDAO.updateProductQuantity(cartId, productId, quantity);
    }

    async deleteProductsFromCart(cartId) {
        return await this.cartDAO.deleteProductsFromCart(cartId);
    }
}

module.exports = new CartRepository();
