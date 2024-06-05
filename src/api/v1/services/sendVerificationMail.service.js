const { mailTransporter } = require("../../../config/nodemailer.config");

const sendVerificationMail = (user) => {
    mailTransporter.sendMail({
        from: {
            name: process.env.MAIL_FROM_NAME,
            address: process.env.MAIL_FROM_ADDRESS,
        },
        to: [user.email],
        subject: "Xác thực Email Hộ tao cái",
        html: `<p>Hình như mày vừa đăng kí với hệ thống của tao. Hãy xác thực hộ tao.</p>
            <a href="${process.env.CLIENT_URL}/verify-email/${user.verificationToken}">Verify Your Email</a>`,
    });
};

module.exports = { sendVerificationMail };
