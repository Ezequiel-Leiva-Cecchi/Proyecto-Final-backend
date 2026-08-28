import * as passwordResetService from '../services/passwordResetService.js';

export const sendEmailRecoveryPassword = async (req, res) => {
    try {
        await passwordResetService.sendEmailRecoveryPassword(req.body.email);
        return res.status(200).json({
            message: 'Si el correo existe, vas a recibir un enlace para recuperar tu contraseña.'
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        await passwordResetService.resetPassword(req.params.resetToken, req.body.password);
        return res.status(200).json({
            message: 'Contraseña actualizada correctamente.',
            redirect: '/login'
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
