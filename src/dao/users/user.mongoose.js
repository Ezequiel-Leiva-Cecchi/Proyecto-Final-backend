import { usersModel } from "../../models/users.model.js";
import { createHash } from "../../utils/bcrypt.js";

export class usersMongoose {
    async getUserById(id) {
        return await usersModel.findOne({ _id: id }).lean({ virtuals: true });
    }

    async updateUserCart(userId, cid) {
        try {
            const user = await usersModel.findOneAndUpdate(
                { _id: userId },
                { cartId: cartId },
                { new: true }
            );
            return user;
        } catch (error) {
            console.error(error);
            throw new Error('Error updating user cart');
        }
    }

    async createUser(userData) {
        try {
            if (!userData.last_name) {
                userData.last_name = 'Not Provided';
            }
            console.log(userData);
            const newUser = await usersModel.create(userData);
            return newUser.toObject({ virtuals: true });
        } catch (error) {
            console.error(error);
            throw new Error('Error creating user');
        }
    }

    async findUserByEmail(email) {
        const user = await usersModel.findOne({ email: email }); 
        if (!user) {
            return null;
        } else {
            return user;
        }

    }

    async getAllUsers() {
        try {
            const user = await usersModel.find({ first_name, last_name, email });
            return user;
        } catch (error) {
            console.error(error);
            throw new Error('Error getting user');
        }
    }

    async updateUserPassword(email, newPassword) {
        try {
            const hashedPassword = createHash(newPassword);
            const updatedUser = await usersModel.findOneAndUpdate(
                { email: email },
                { password: hashedPassword },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            console.error(error);
            throw new Error('Error updating user password');
        }
    }

    async deleteInactiveUsers() {

    }
}
