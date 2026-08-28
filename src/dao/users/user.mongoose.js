import { usersModel } from '../../models/users.model.js';
import { createHash } from '../../utils/bcrypt.js';

export class usersMongoose {
    async getUserById(id) {
        return usersModel.findById(id).lean({ virtuals: true });
    }

    async updateUserCart(userId, cartId) {
        const user = await usersModel.findByIdAndUpdate(
            userId,
            { cartId },
            { new: true }
        );
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async createUser(userData) {
        const data = {
            ...userData,
            last_name: userData.last_name || 'No informado'
        };
        const newUser = await usersModel.create(data);
        return newUser.toObject({ virtuals: true });
    }

    async findUserByEmail(email) {
        if (!email) return null;
        return usersModel.findOne({ email: String(email).toLowerCase().trim() });
    }

    async getAllUsers() {
        return usersModel.find().select('-password').sort({ createdAt: -1 }).lean({ virtuals: true });
    }

    async updateUserPassword(email, newPassword) {
        const hashedPassword = createHash(newPassword);
        return usersModel.findOneAndUpdate(
            { email: String(email).toLowerCase().trim() },
            { password: hashedPassword },
            { new: true }
        );
    }

    async updateUserRole(userId, isAdmin) {
        if (!['User', 'Admin'].includes(isAdmin)) {
            throw new Error('Invalid role');
        }
        return usersModel.findByIdAndUpdate(userId, { isAdmin }, { new: true });
    }

    async deleteInactiveUsers() {
        return [];
    }
}
