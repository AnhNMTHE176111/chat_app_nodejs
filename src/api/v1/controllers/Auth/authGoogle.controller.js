const { CLIENT_URL } = require("../../helpers/const");
const {
    setUserAccessToken,
    setUserRefreshToken,
} = require("../../services/user.service");

const AuthGoogle = {
    callback: async (req, res) => {
        const user = req.user;
        try {
            setUserAccessToken(user, res);
            setUserRefreshToken(user);
            await user.save();
        } catch (error) {
            console.log("error", error);
        }
        return res.redirect(`${CLIENT_URL}`);
    },
};

module.exports = AuthGoogle;
