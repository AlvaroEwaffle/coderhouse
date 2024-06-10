const MongoTicketDAO = require('../dao/mongo_dao/TicketsDAO');

class TicketRepository {
    constructor() {
        this.ticketDAO = MongoTicketDAO;
    }

    async createTicket(ticketData) {
        return await this.ticketDAO.createTicket(ticketData);
    }

    async getTicketById(ticketId) {
        return await this.ticketDAO.getTicketById(ticketId);
    }

    async getAllTickets() {
        return await this.ticketDAO.getAllTickets();
    }

    async updateTicket(ticketId, updateData) {
        return await this.ticketDAO.updateTicket(ticketId, updateData);
    }

    async deleteTicket(ticketId) {
        return await this.ticketDAO.deleteTicket(ticketId);
    }
}

module.exports = new TicketRepository();
