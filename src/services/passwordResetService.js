import { randomBytes } from 'node:crypto';
import { passwordResetDAO } from '../dao/passwordReset/indexPasswordReset.js';
import { usersDAO } from '../dao/users/indexUsers.js';
import transporter from '../config/nodemailer.config.js';

const appUrl = () => process.env.APP_URL || `http://localhost:${process.env.PORT || 8080}`;

export const sendEmailRecoveryPassword = async (email) => {
    const normalizedEmail = String(email || '').toLowerCase().trim();
    if (!normalizedEmail) throw new Error('Email requerido');

    const user = await usersDAO.findUserByEmail(normalizedEmail);
    if (!user) {
        return;
    }

    const resetToken = randomBytes(32).toString('hex');
    await passwordResetDAO.createResetToken(normalizedEmail, resetToken);

    if (!process.env.GOOGLE_USER || !process.env.GOOGLE_PASSWORD) {
        throw new Error('El servicio de email no está configurado');
    }

    await transporter.sendMail({
        from: process.env.GOOGLE_USER,
        to: normalizedEmail,
        subject: 'Recuperá tu contraseña · Nexo Store',
        text: `Recibimos una solicitud para cambiar tu contraseña. Abrí este enlace dentro de la próxima hora: ${appUrl()}/reset-password/${resetToken}`
    });
};

export const resetPassword = async (resetToken, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const resetInfo = await passwordResetDAO.findResetTokenByToken(resetToken);
    if (!resetInfo) {
        throw new Error('El enlace es inválido o expiró');
    }

    await usersDAO.updateUserPassword(resetInfo.email, newPassword);
    await passwordResetDAO.deleteResetToken(resetToken);
};
