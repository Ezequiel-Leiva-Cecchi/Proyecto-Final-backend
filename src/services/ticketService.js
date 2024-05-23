import { ticketDAO } from '../dao/ticket/indexTicket.js';
import { sendTicketEmail } from './emailService.js';

export const generateTicket = async (cartId, purchaseDatetime, amount, purchaser) => {
    try {
        const ticket = await ticketDAO.createTicket({
            cartId,
            code: generateUniqueCode(),
            purchaseDatetime,
            amount,
            purchaser
        });

        // Enviar correo electrónico con el ticket
        await sendTicketEmail(
            purchaser.email,
            'Your Purchase Ticket',
            `Thank you for your purchase! Your ticket code is ${ticket.code}`
        );

        console.log("Ticket generated and email sent successfully:", ticket);
        return ticket;
    } catch (error) {
        console.error("Error generating ticket:", error);
        throw new Error('Failed to generate ticket');
    }
};

// Función para generar un código único
const generateUniqueCode = () => {
    const uniqueId = new mongoose.Types.ObjectId();
    return uniqueId.toString();
};
