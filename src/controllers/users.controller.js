import * as usersService from '../services/usersServices.js';
import { usersDAO } from '../dao/users/indexUsers.js';
import { cartDAO } from '../dao/cart/indexCart.js';

const toPlainUser = (user) => {
    const plain = typeof user?.toObject === 'function' ? user.toObject({ virtuals: true }) : { ...user };
    if (plain) delete plain.password;
    return plain;
};

const ensureUserCart = async (user) => {
    const plain = toPlainUser(user);
    if (plain.cartId || plain.cid) {
        return plain;
    }
    const cart = await cartDAO.createCart();
    const updated = await usersDAO.updateUserCart(plain._id || plain.id, cart._id);
    return toPlainUser(updated);
};

export const register = async (req, res) => {
    try {
        const newUser = await usersService.register(req.body);
        const userWithCart = await ensureUserCart(newUser);
        return res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: userWithCart,
            redirect: '/login'
        });
    } catch (error) {
        const status = error.message.includes('ya está en uso') || error.message.includes('6 caracteres') ? 400 : 500;
        return res.status(status).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const authenticatedUser = req.user || await usersService.login(req.body);
        const userWithCart = await ensureUserCart(authenticatedUser);
        req.session.user = userWithCart;
        return res.status(200).json({
            message: 'Sesión iniciada correctamente',
            user: userWithCart,
            redirect: '/'
        });
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

export const logout = async (req, res, next) => {
    req.logout((logoutError) => {
        if (logoutError) return next(logoutError);
        req.session.destroy((sessionError) => {
            if (sessionError) return next(sessionError);
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Sesión cerrada correctamente', redirect: '/login' });
        });
    });
};

export const loginWithGithub = async (req, res, next) => {
    try {
        const userWithCart = await ensureUserCart(req.user);
        req.session.user = userWithCart;
        return res.redirect('/');
    } catch (error) {
        return next(error);
    }
};

export const createAdmin = async (req, res) => {
    try {
        const newAdmin = await usersService.registerAdmin(req.body);
        return res.status(201).json({ message: 'Administrador creado correctamente', user: toPlainUser(newAdmin) });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const getAllUsers = async (_req, res) => {
    try {
        const users = await usersDAO.getAllUsers();
        return res.status(200).json(users);
    } catch (_error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
