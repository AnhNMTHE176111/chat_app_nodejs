const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/user.model");
const {
    SALT_ROUNDS,
    PASSWORD_RESET_TOKEN_TIME_TO_LIVE_MINUTES,
} = require("../../helpers/const");
const crypto = require("crypto");
const moment = require("moment");
const {
    sendVerificationMail,
} = require("../../services/sendVerificationMail.service");
const {
    setUserAccessToken,
    setUserRefreshToken,
} = require("../../services/user.service");
const {
    sendResetPasswordTokenMail,
} = require("../../services/sendResetPasswordTokenMail.service");
const { cookieOption, redisClient } = require("../../../../config");

const AuthController = express.Router();

AuthController.register = async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
        const hashPassword = bcrypt.hashSync(password.toString(), SALT_ROUNDS);
        const emailToken = crypto.randomBytes(64).toString("hex");
        const newUser = await User.create({
            email: email,
            fullName: fullName,
            password: hashPassword,
            verificationToken: emailToken,
        });
        sendVerificationMail(newUser);
        return res.sendSuccess(
            {
                must_verify_email: true,
            },
            "create new user"
        );
    } catch (error) {
        return res.sendError(error?.message);
    }
};

AuthController.verifyEmail = async (req, res) => {
    const user = req.user;
    try {
        user.verificationToken = null;
        user.verificationStatus = true;
        await user.save();
        return res.sendSuccess({
            email: user.email,
            verificationStatus: user.verificationStatus,
        });
    } catch (error) {
        return res.sendError(error?.message);
    }
};

AuthController.resendActivationEmail = async (req, res) => {
    const user = req.user;
    try {
        const emailToken = crypto.randomBytes(64).toString("hex");
        user.emailToken = emailToken;
        await user.save();
        sendVerificationMail(user);
        return res.sendSuccess(
            null,
            "We have e-mailed your account confirmation link."
        );
    } catch (error) {
        return res.sendError(error?.message);
    }
};

AuthController.login = async (req, res) => {
    const user = req.user;
    try {
        setUserAccessToken(user, res);
        if (req.body.remember_me) {
            setUserRefreshToken(user);
        }
        await user.save();
        const dataResponse = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            accessToken: user.accessToken,
            tokenExpireAt: user.tokenExpireAt,
        };
        return res.sendSuccess(dataResponse, "Login successfully!");
    } catch (error) {
        console.log("error", error);
        return res.sendError(error?.errorResponse || error);
    }
};

AuthController.forgotPassword = async (req, res) => {
    const user = req.user;
    try {
        const passwordResetToken = crypto.randomBytes(64).toString("hex");
        user.passwordResetToken = passwordResetToken;
        user.passwordResetExpires = moment().add(
            PASSWORD_RESET_TOKEN_TIME_TO_LIVE_MINUTES,
            "minutes"
        );
        await user.save();
        sendResetPasswordTokenMail(user);
        return res.sendSuccess(
            null,
            "We have e-mailed your reset password link."
        );
    } catch (error) {
        return res.sendError(error?.message);
    }
};

AuthController.resetPassword = async (req, res) => {
    const user = req.user;
    const new_password = req.new_password;
    try {
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        const hashPassword = bcrypt.hashSync(
            new_password.toString(),
            SALT_ROUNDS
        );
        user.password = hashPassword;
        await user.save();
        return res.sendSuccess(null, "Reset Password Success");
    } catch (error) {
        return res.sendError(error?.message);
    }
};

AuthController.currentUser = async (req, res) => {
    const user = req.user;
    return res.sendSuccess({
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            accessToken: user.accessToken,
            tokenExpireAt: user.tokenExpireAt,
            role: user.role,
        },
    });
};

AuthController.token = async (req, res) => {
    const user = req.user;
    try {
        setUserAccessToken(user, res);
        setUserRefreshToken(user);
        await user.save();
        return res.sendSuccess(null, "Token refresh!");
    } catch (error) {
        return res.sendError(error?.message);
    }
};

AuthController.logout = async (req, res) => {
    res.clearCookie("access_token", {
        ...cookieOption,
    });
    try {
        await redisClient.hdel(req.userId, "refresh_token");
        return res.sendSuccess(null, "Logged out successfully.");
    } catch (error) {
        return res.sendError(error?.message || error);
    }
};

AuthController.updateProfile = async (req, res) => {};

module.exports = AuthController;
