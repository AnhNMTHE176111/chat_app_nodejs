const cookieOption = {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
};

module.exports = cookieOption;
