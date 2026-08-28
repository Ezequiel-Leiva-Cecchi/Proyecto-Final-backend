import { Router } from 'express';
import passport from 'passport';

import { requireAuth, requireAdminAuth } from '../middlewares/authMiddleware.js';
import { register, login, logout, loginWithGithub, createAdmin, getAllUsers } from '../controllers/users.controller.js';

const sessionRoutes = Router();

sessionRoutes.post('/register', passport.authenticate('register', { session: false }), register);
sessionRoutes.post('/login', passport.authenticate('login'), login);
sessionRoutes.post('/logout', requireAuth, logout);

sessionRoutes.get('/github', (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        return res.status(503).json({ error: 'GitHub login no está configurado.' });
    }
    return passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

sessionRoutes.get('/githubcallback', (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        return res.redirect('/login');
    }
    return passport.authenticate('github', { failureRedirect: '/login' })(req, res, () => loginWithGithub(req, res, next));
});

sessionRoutes.post('/admin/register', requireAdminAuth, createAdmin);
sessionRoutes.get('/users', requireAdminAuth, getAllUsers);
sessionRoutes.get('/current', requireAuth, (req, res) => res.json({ user: req.session.user }));

export default sessionRoutes;
