import PasswordResetModel from '../../models/passwordReset.model.js';

export class PasswordResetMongoose {
    async createResetToken(email, token) {
        await PasswordResetModel.deleteMany({ email: String(email).toLowerCase().trim() });
        return PasswordResetModel.create({ email, token });
    }

    async findResetTokenByEmail(email) {
        return PasswordResetModel.findOne({ email: String(email).toLowerCase().trim() }).lean();
    }

    async findResetTokenByToken(token) {
        return PasswordResetModel.findOne({ token }).lean();
    }

    async deleteResetToken(token) {
        return PasswordResetModel.deleteOne({ token });
    }
}
