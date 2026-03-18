const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (to, otp) => {
    const mailOptions = {
        from: `"Code Caramel" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Your Login OTP for Code Caramel',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #f97316;">Code Caramel Login</h2>
                <p>Use the following 6-digit One-Time Password (OTP) to complete your sign-in process.</p>
                <h1 style="letter-spacing: 5px; color: #1e293b; background-color: #f1f5f9; padding: 15px; border-radius: 8px; display: inline-block;">${otp}</h1>
                <p style="color: #64748b;">This OTP is valid for 5 minutes. Do not share this code with anyone.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = sendOTP;
