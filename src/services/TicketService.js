const TicketRepository = require('../repositories/TicketRepository');
const CartRepository = require('../repositories/CartRepository');

class TicketService {
    async createTicket(user) {
        const cart = await CartRepository.getCartById(user.cart);
        console.log(cart)
        if (!cart || cart.products.length === 0) {
            throw new Error('Cart is empty or does not exist');
        }
        const totalAmount = cart.products.reduce((sum, product) => sum + (product.quantity * product.product.price), 0);
        const ticketData = {
            amount: totalAmount,
            purchaser: user.email
        };
        console.log(ticketData)
        const ticket = await TicketRepository.createTicket(ticketData);
        return ticket;

    }

    async getTicketById(ticketId) {
        return await TicketRepository.getTicketById(ticketId);
    }

    async getAllTickets() {
        return await TicketRepository.getAllTickets();
    }

    async updateTicket(ticketId, updateData) {
        return await TicketRepository.updateTicket(ticketId, updateData);
    }

    async deleteTicket(ticketId) {
        return await TicketRepository.deleteTicket(ticketId);
    }
}

module.exports = new TicketService();
