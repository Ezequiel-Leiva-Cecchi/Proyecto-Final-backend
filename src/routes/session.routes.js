import { Router } from "express";
import passport from "passport";

import { requireAuth, requireAdminAuth } from "../middlewares/authMiddleware.js";
import { register, login, logout, loginWithGithub, createAdmin,getAllUsers } from "../controllers/users.controller.js";

const sessionRoutes = Router();

sessionRoutes.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), register); 
sessionRoutes.post('/login', passport.authenticate('login'), login);
sessionRoutes.post('/logout', requireAuth, logout);
sessionRoutes.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
sessionRoutes.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), loginWithGithub);
sessionRoutes.post('/admin/register', requireAdminAuth, createAdmin);
sessionRoutes.get('/current', requireAuth, getAllUsers);
export default sessionRoutes;
