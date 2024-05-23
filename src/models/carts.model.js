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
            required: true
        },
        subtotal: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        }
    }],
    total: {
        type: Number,
        default: 0
    }
});

cartSchema.virtual('id').get(function () {
    return this._id.toString();
});

cartSchema.methods.calculateSubtotal = function() {
    this.products.forEach(item => {
        item.subtotal = item.product.price * item.quantity;
    });
};

cartSchema.set('toJSON', { virtuals: true });

cartSchema.set('toObject', { virtuals: true });

const cartModel = mongoose.model('Cart', cartSchema);

export default cartModel;
