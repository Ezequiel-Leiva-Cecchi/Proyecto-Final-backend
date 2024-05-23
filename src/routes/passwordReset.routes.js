import { Router } from 'express';
import { resetPassword, sendEmailRecoveryPassword } from '../controllers/passwordReset.controller.js';

const passwordResetRouter = Router();

passwordResetRouter.post('/send-email', sendEmailRecoveryPassword);
passwordResetRouter.post('/reset/:resetToken', resetPassword);

export default passwordResetRouter;
