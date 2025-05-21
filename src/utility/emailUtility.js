
require('dotenv').config();
const nodemailer = require("nodemailer");

const EmailSend = async (EmailTo, EmailText, EmailSubject) => {
    try {
        let transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Secure with SSL
            auth: {
                user: process.env.EMAIL_USER, // From environment variables
                pass: process.env.EMAIL_PASS, // From environment variables
            },
        });

        let mailOption = {
            from: 'PlantNest <aminminhaz55@gmail.com>',
            to: EmailTo,
            subject: EmailSubject,
            text: EmailText,
        };

        return await transport.sendMail(mailOption);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = EmailSend;
