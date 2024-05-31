// services/TicketService.js
const TicketRepository = require('../repositories/TicketRepository');

class TicketService {
  async createTicket(ticketData) {
    return await TicketRepository.createTicket(ticketData);
  }
}

module.exports = new TicketService();
