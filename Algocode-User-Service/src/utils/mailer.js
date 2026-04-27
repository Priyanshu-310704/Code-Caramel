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
        console.log(`\n=========================================`);
        console.log(`[DEV] Sending OTP to ${to}: ${otp}`);
        console.log(`=========================================\n`);
        
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('\n[MAILER ERROR] Failed to send email. Gmail requires an App Password instead of your normal account password.');
        console.log(`[DEV FALLBACK] Your OTP for ${to} is: ${otp}`);
        console.log(`Please enter this OTP in the UI to login.\n`);
        return true; // Return true to unblock local testing
    }
};

module.exports = sendOTP;
