import { usersDAO } from '../dao/users/indexUsers.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';

const normalizeEmail = (email) => String(email || '').toLowerCase().trim();

export const register = async (userData) => {
    const email = normalizeEmail(userData.email);
    const password = userData.password;

    if (!email) {
        throw new Error('Correo electrónico requerido');
    }

    const existingUser = await usersDAO.findUserByEmail(email);
    if (existingUser) {
        throw new Error('El correo electrónico ya está en uso');
    }

    if (!password || password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const bootstrapAdminEmail = normalizeEmail(process.env.BOOTSTRAP_ADMIN_EMAIL);
    const role = bootstrapAdminEmail && bootstrapAdminEmail === email ? 'Admin' : 'User';

    return usersDAO.createUser({
        ...userData,
        email,
        isAdmin: role,
        password: createHash(password)
    });
};

export const registerAdmin = async (userData) => {
    const email = normalizeEmail(userData.email);
    if (!email || !userData.password || userData.password.length < 6) {
        throw new Error('Email y contraseña válida son obligatorios');
    }
    const existingUser = await usersDAO.findUserByEmail(email);
    if (existingUser) {
        throw new Error('El correo electrónico ya está en uso');
    }
    return usersDAO.createUser({
        ...userData,
        email,
        isAdmin: 'Admin',
        password: createHash(userData.password)
    });
};

export const login = async ({ email, password }) => {
    const existingUser = await usersDAO.findUserByEmail(normalizeEmail(email));
    if (!existingUser || !password || !isValidPassword(existingUser, password)) {
        throw new Error('Correo electrónico o contraseña incorrectos');
    }
    return existingUser;
};

export const logout = async (req) => {
    await new Promise((resolve, reject) => {
        req.session.destroy((error) => error ? reject(error) : resolve());
    });
};

export const loginWithGithub = async (userData) => userData;

export const upgradeUserToPremium = async (userId) => {
    const updatedUser = await usersDAO.upgradeToPremium?.(userId);
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedUser;
};
