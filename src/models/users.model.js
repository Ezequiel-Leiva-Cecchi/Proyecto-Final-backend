import mongoose from 'mongoose';
import leanVirtuals from 'mongoose-lean-virtuals';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    cid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    }
}, { timestamps: true });

userSchema.virtual('id').get(function () {
    return this._id.toString();
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });
userSchema.plugin(leanVirtuals);

export const usersModel = mongoose.model('users', userSchema);
