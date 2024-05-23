import TicketModel from "../../models/ticketModel.js";

export class ticketMongoose {
    async createTicket(ticketData) {
        try {
            const ticket = new TicketModel(ticketData);
            await ticket.save();
            return ticket.toObject({ virtuals: true });
        } catch (error) {
            console.error("Error creating ticket:", error);
            throw new Error('Failed to create ticket');
        }
    }

    // Agrega más métodos según necesites, por ejemplo:
    async getTicketById(id) {
        try {
            const ticket = await TicketModel.findById(id).lean({ virtuals: true });
            return ticket;
        } catch (error) {
            console.error("Error getting ticket by id:", error);
            throw new Error('Failed to get ticket by id');
        }
    }

    async updateTicket(id, updateData) {
        try {
            const ticket = await TicketModel.findByIdAndUpdate(id, updateData, { new: true });
            return ticket;
        } catch (error) {
            console.error("Error updating ticket:", error);
            throw new Error('Failed to update ticket');
        }
    }

    async deleteTicket(id) {
        try {
            await TicketModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting ticket:", error);
            throw new Error('Failed to delete ticket');
        }
    }
}
