import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60
    }
});

passwordResetSchema.virtual('id').get(function () {
    return this._id.toString();
});

passwordResetSchema.set('toJSON', { virtuals: true });
passwordResetSchema.set('toObject', { virtuals: true });

const PasswordResetModel = mongoose.model('PasswordReset', passwordResetSchema);
export default PasswordResetModel;
