import * as adminService from '../services/adminService.js';

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
};

// Cambiar el rol de un usuario
export const updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        const updatedUser = await adminService.changeUserRole(userId, newRole);
        res.status(200).json({ message: 'Rol de usuario actualizado exitosamente', user: updatedUser });
    } catch (error) {
        console.error('Error cambiando el rol del usuario:', error);
        res.status(500).json({ error: 'Error cambiando el rol del usuario' });
    }
};

// Eliminar un usuario
export const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        await adminService.deleteUser(userId);
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Error eliminando usuario' });
    }
};
