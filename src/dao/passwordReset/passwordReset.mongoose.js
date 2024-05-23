import PasswordResetModel from '../../models/passwordReset.model.js';

export class PasswordResetMongoose {
    async createResetToken(email, token) {
        const resetToken = new PasswordResetModel({
            email,
            token,
        });
        await resetToken.save();
        return resetToken.toObject();
    }

    async findResetTokenByEmail(email) {
        return await PasswordResetModel.findOne({ email }).lean();
    }

    async findResetTokenByToken(token) {
        return await PasswordResetModel.findOne({ token }).lean();
    }

    async deleteResetToken(token) {
        return await PasswordResetModel.deleteOne({ token });
    }
}