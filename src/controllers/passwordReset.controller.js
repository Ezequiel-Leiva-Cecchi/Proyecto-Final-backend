import * as passwordResetService from '../services/passwordResetService.js';

export const sendEmailRecoveryPassword = async (req, res) => {
    try {
        const { email, resetToken } = req.body;
        await passwordResetService.sendEmailRecoveryPassword(email, resetToken);
        return res.status(200).json({ message: 'Password recovery email sent successfully' });
    } catch (error) {
        console.error('Error sending password recovery email:', error);
        return res.status(500).json({ error: 'Failed to send password recovery email' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { resetToken } = req.params;
        const { password } = req.body;
        
        await passwordResetService.resetPassword(resetToken, password);
        
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: 'Failed to reset password' });
    }
};
