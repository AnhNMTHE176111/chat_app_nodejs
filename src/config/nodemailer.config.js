const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_SECURE
        ? process.env.MAIL_PORT_SECURE
        : process.env.MAIL_PORT,
    // Use `true` for port 465, `false` for all other ports
    secure: process.env.MAIL_SECURE,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

module.exports = { mailTransporter };
