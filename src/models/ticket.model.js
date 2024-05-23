import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    cartId: { type: mongoose.Schema.Types.ObjectId, required: true },
    code: { type: String, required: true, unique: true },
    purchaseDatetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: {
        email: { type: String, required: true },
        name: { type: String, required: true }
    }
});

const ticketModel = mongoose.model('Ticket', ticketSchema);

export default ticketModel;
