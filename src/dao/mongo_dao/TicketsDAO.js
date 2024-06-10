const Ticket = require('../../models/Ticket.Model.js');

class MongoTicketDAO {
    async createTicket(ticketData) {
        return await Ticket.create(ticketData);
    }

    async getTicketById(ticketId) {
        return await Ticket.findById(ticketId).populate('user cart').lean();
    }

    async getAllTickets() {
        return await Ticket.find().populate('user cart').lean();
    }

    async updateTicket(ticketId, updateData) {
        return await Ticket.findByIdAndUpdate(ticketId, updateData, { new: true });
    }

    async deleteTicket(ticketId) {
        return await Ticket.findByIdAndDelete(ticketId);
    }
}

module.exports = new MongoTicketDAO();
