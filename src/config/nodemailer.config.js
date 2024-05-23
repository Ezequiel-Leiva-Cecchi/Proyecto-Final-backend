import nodemailer from 'nodemailer';

const secretKey = process.env.GOOGLE_PASSWORD;
const transporter = nodemailer.createTransport({
    service: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'ezequielleivacecchi@gmail.com',
        pass: secretKey
    }
});

export default transporter;