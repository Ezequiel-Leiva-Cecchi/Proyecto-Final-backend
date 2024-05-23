import express from 'express';
import {getAllUsers,updateUserRole,deleteUserById} from '../controllers/admin.controller.js';
import { requireAdminAuth } from '../middlewares/authMiddleware.js';  

const adminRouter = express.Router();

adminRouter.get('/users', requireAdminAuth, getAllUsers);
adminRouter.put('/users/role', requireAdminAuth, updateUserRole);
adminRouter.delete('/users/:userId', requireAdminAuth, deleteUserById);

export default adminRouter;
