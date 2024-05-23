import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });
const orderModel = mongoose.model('orders', orderSchema);

export default orderModel;
