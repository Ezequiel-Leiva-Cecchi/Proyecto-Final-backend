import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD
    }
});

export default transporter;
