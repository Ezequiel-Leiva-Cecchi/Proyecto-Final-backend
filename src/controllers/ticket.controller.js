import * as ticketService from '../services/ticketService.js';
import { cartDAO } from '../dao/cart/indexCart.js';

export const generateTicketController = async (req, res, next) => {
    try {
        const { cid, purchaseDatetime, amount, purchaser } = req.body;

        // Verificar si se proporcionaron todos los datos necesarios
        if (!cid || !purchaseDatetime || !amount || !purchaser) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verificar si el carrito existe
        const cart = await cartDAO.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Generar el ticket
        const ticket = await ticketService.generateTicket(cid, purchaseDatetime, amount, purchaser);
        res.json({ message: 'Ticket generated successfully', ticket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
