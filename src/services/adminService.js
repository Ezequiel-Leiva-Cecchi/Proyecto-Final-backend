import { usersDAO } from '../dao/users/indexUsers.js';
import { adminDAO } from '../dao/admin/indexAdmin.js';


export const getAllUsers = async () => {
    try {
        return await usersDAO.getAllUsers();
    } catch (error) {
        throw new Error('Error obteniendo usuarios');
    }
};

export const changeUserRole = async (userId, newRole) => {
    try {
        return await adminDAO.changeUserRole(userId, newRole);
    } catch (error) {
        throw new Error('Error cambiando el rol del usuario');
    }
};

export const deleteUser = async (userId) => {
    try {
        await adminDAO.deleteUser(userId);
    } catch (error) {
        throw new Error('Error eliminando usuario');
    }
};
