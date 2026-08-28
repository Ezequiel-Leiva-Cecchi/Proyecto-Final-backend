import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1,
            required: true
        }
    }]
}, { timestamps: true });

cartSchema.virtual('id').get(function () {
    return this._id.toString();
});

cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

const cartModel = mongoose.model('Cart', cartSchema);
export default cartModel;
