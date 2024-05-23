import passport from "passport";
import * as usersService from '../services/usersServices.js';
import { usersDAO } from "../dao/users/indexUsers.js";
import {cartDAO} from "../dao/cart/indexCart.js"
export const register = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await usersService.register(userData);
        
        await cartDAO.createCart(newUser._id);

        res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        if (error.message.includes('El correo electrónico ya está en uso')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body; 
        const existingUser = await usersService.login({ email, password }); 
        if (!existingUser) {
            throw new Error('Invalid email or password');
        }
        req.session.user = existingUser;
        console.log("User logged in successfully:", existingUser);
        res.status(200).json({ msg: "User logged in successfully" });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(401).json({ error: error.message }); 
    }
};


export const logout = async (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                console.error("Error logging out:", err);
                return next(err);
            }
            req.session.destroy(() => {
                console.log("User logged out successfully");
                res.status(200).json({ msg: "User logged out successfully" });
            });
        });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(400).json({ error: error.message });
    }
};

export const loginWithGithub = (req, res, next) => {
    passport.authenticate('github', (err, user, info) => {
        if (err) {
            console.error("Error logging in with Github:", err);
            res.status(400).json({ error: err.message });
            return;
        }
        if (!user) {
            console.error("Failed to login with Github");
            res.status(400).json({ error: "Failed to login with Github" });
            return;
        }
        req.session.user = user;
        console.log("User logged in with Github successfully:", req.session.user);
        res.status(200).json({ msg: "User logged in with Github successfully" });
    })(req, res, next);
};

export const createAdmin = async (req, res, next) => {
    try {
        if (!req.session.user || req.session.user.isAdmin !== true) {
            return res.status(403).json({ error: 'Forbidden. Admin access required.' });
        }
        const { first_name, last_name, email, password } = req.body;
        const existingUser = await usersService.registerAdmin({ first_name, last_name, email, password });
        res.status(201).json({ message: 'Admin user created successfully', user: existingUser });
    } catch (error) {
        console.error("Error creating admin user:", error);
        res.status(400).json({ error: error.message });
    }
};

export const getAllUsers = async(req,res) => {
    try {
        const users = await usersDAO.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({error:'Error interno del servidor'});
    }
};
