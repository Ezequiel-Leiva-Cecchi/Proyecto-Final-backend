import { usersModel } from "../../models/users.model.js";

export class adminMongoose {
    // Cambiar el rol de un usuario
    async changeUserRole(userId, newRole) {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(
                userId,
                { isAdmin: newRole },
                { new: true }
            ).lean({ virtuals: true });
            return updatedUser;
        } catch (error) {
            console.error('Error cambiando el rol del usuario:', error);
            throw new Error('Error cambiando el rol del usuario');
        }
    }

    // Eliminar un usuario
    async deleteUser(userId) {
        try {
            await usersModel.findByIdAndDelete(userId);
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            throw new Error('Error eliminando usuario');
        }
    }
}
