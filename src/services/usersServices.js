import { usersDAO } from '../dao/users/indexUsers.js';
import { createHash } from '../utils/bcrypt.js';

export const register = async (userData) => {
    try {
        const { email, password } = userData;

        // Validar correo electrónico
        if (!email) {
            throw new Error('Correo electrónico requerido');
        }

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await usersDAO.findUserByEmail(email);
        if (existingUser) {
            throw new Error('El correo electrónico ya está en uso');
        }

        // Validar contraseña
        if (!password || password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        const isAdmin = (email === "adminCoder@coder.com" && password === "adminCod3r123") ? "Admin" : "User";
        const hashedPassword = createHash(password);

        const newUser = {
            ...userData,
            isAdmin: isAdmin,
            password: hashedPassword
        };

        const createdUser = await usersDAO.createUser(newUser);
        return createdUser;
    } catch (error) {
        throw error;
    }
};


export const login = async (userData) => {
    try {
        const existingUser = await usersDAO.findUserByEmail(userData.email);
        if (!existingUser) {
            throw new Error('Invalid email or password');
        }
        console.log("User logged in successfully:", existingUser);
        return existingUser;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw new Error('Failed to login');
    }
};

export const logout = async (req) => {
    try {
        await req.session.destroy();
        console.log("User logged out successfully");
    } catch (error) {
        console.error("Error logging out:", error);
        throw new Error('Failed to logout');
    }
};

export const loginWithGithub = async (userData) => {
    return userData;
};
export const upgradeUserToPremium = async (userId) => {
    try {
        const updatedUser = await usersDAO.upgradeToPremium(userId);
        return updatedUser;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};