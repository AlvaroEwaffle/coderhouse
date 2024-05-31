// repositories/TicketRepository.js
const Ticket = require('../models/Ticket.Model'); // Assuming you have a Ticket model defined

class TicketRepository {
  async createTicket(ticketData) {
    const ticket = new Ticket(ticketData);
    return await ticket.save();
  }
}

module.exports = new TicketRepository();
