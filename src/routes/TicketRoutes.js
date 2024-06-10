const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');

router.post('/tickets', TicketController.createTicket);
router.get('/tickets/:tid', TicketController.getTicketById);
router.get('/tickets', TicketController.getAllTickets);
router.put('/tickets/:tid', TicketController.updateTicket);
router.delete('/tickets/:tid', TicketController.deleteTicket);

module.exports = router;
