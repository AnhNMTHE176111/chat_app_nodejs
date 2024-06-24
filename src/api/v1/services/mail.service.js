const { mailTransporter } = require("../../../config/nodemailer.config");

const sendResetPasswordTokenMail = (user) => {
    mailTransporter.sendMail({
        from: {
            name: process.env.MAIL_FROM_NAME,
            address: process.env.MAIL_FROM_ADDRESS,
        },
        to: [user.email],
        subject: "Reset Mật Khẩu",
        html: `<p>Hình như mày quên mịa mất mật khẩu. Nhấp vào link sau để reset mật khẩu nhé.</p>
            <a href="${process.env.CLIENT_URL}/reset-password/${user.passwordResetToken}">Reset Password</a>
            <p>Nên nhớ nó sẽ hết hạn vào 5 phút nữa thôi đấy</p>`,
    });
};

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

module.exports = { sendResetPasswordTokenMail, sendVerificationMail };