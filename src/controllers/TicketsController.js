const TicketService = require('../services/TicketService');

// Create Ticket
exports.createTicket = async (req, res) => {
    try {
        const ticketData = req.body;
        const newTicket = await TicketService.createTicket(ticketData);
        res.status(201).json(newTicket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get Ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        const ticketId = req.params.tid;
        const ticket = await TicketService.getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        console.error('Error retrieving ticket:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get All Tickets
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await TicketService.getAllTickets();
        res.json(tickets);
    } catch (error) {
        console.error('Error retrieving tickets:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update Ticket
exports.updateTicket = async (req, res) => {
    try {
        const ticketId = req.params.tid;
        const updateData = req.body;
        const updatedTicket = await TicketService.updateTicket(ticketId, updateData);
        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(updatedTicket);
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
    try {
        const ticketId = req.params.tid;
        const deletedTicket = await TicketService.deleteTicket(ticketId);
        if (!deletedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(deletedTicket);
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
