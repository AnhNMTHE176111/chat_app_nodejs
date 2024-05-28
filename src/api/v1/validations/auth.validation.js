const express = require("express");
const {
    isSame,
    emailRule,
    requiredRule,
    usernameRule,
    passwordRule,
    isPastDeadline,
    isDifferent,
} = require("../helpers/validation.helper");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const AuthRequest = express.Router();

AuthRequest.registerRequest = async (req, res, next) => {
    const { email, password, password_confirmation, fullName, username } =
        req.body;
    try {
        requiredRule(email, "Email");
        requiredRule(username, "Username");
        requiredRule(password, "Password");
        requiredRule(password_confirmation, "Password Confirmation");
        // requiredRule(fullName, "Full Name");
        emailRule(email);
        usernameRule(username);
        passwordRule(password);
        isSame(
            password,
            password_confirmation,
            "Password must be same as Password Confirmation"
        );
        const user = await User.findOne({
            $or: [{ email }, { username }],
        });
        isDifferent(email, user?.email, "Email is taken.");
        isDifferent(username, user?.username, "Username is taken.");
    } catch (error) {
        return res.sendError(error.message);
    }
    next();
};

AuthRequest.loginRequest = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        requiredRule(email, "Email");
        requiredRule(password, "Password");
        const user = await User.findOneByEmail({ email });
        if (!user.verificationStatus) {
            return res.sendError("Unauthorized Account", 401);
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.sendError("Wrong password", 404);
        }
        req.user = user;
    } catch (error) {
        return res.sendError(error.message);
    }
    next();
};

AuthRequest.verifyEmailRequest = async (req, res, next) => {
    const { emailToken } = req.body;
    if (!emailToken) {
        return res.sendError("Email Token Not Found...", 404);
    }
    try {
        const user = await User.findOne({
            verificationToken: emailToken,
            verificationStatus: false,
        });
        if (!user) {
            return res.sendError(
                "Email verification failed! Invalid Token!",
                404
            );
        }
        req.user = user;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

AuthRequest.forgotPasswordRequest = async (req, res, next) => {
    const { email } = req.body;
    try {
        requiredRule(email, "Email");
        const user = await User.findOneByEmail({ email });
        req.user = user;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

AuthRequest.resetPasswordRequest = async (req, res, next) => {
    const {
        email,
        new_password,
        new_password_confirmation,
        passwordResetToken,
    } = req.body;
    try {
        requiredRule(email, "Email");
        requiredRule(new_password, "New Password");
        requiredRule(new_password_confirmation, "New Password Confirmation");
        requiredRule(passwordResetToken, "Password Reset Token");
        emailRule(email);
        passwordRule(new_password);
        isSame(
            new_password,
            new_password_confirmation,
            "New Password must be same as New Password Confirmation"
        );
        const user = await User.findOneByEmail({ email });
        isSame(
            user.passwordResetToken,
            passwordResetToken,
            "Invalid Password Reset Token."
        );
        isPastDeadline(
            user.passwordResetExpires,
            "Password Reset Time has Expired."
        );
        req.user = user;
        req.new_password = new_password;
    } catch (error) {
        return res.sendError(error.message);
    }
    next();
};

AuthRequest.sendActivationRequest = async (req, res, next) => {
    const { email } = req.body;
    try {
        requiredRule(email, "Email");
        const user = await User.findOneByEmail({ email });
        if (user.verificationStatus) {
            return res.sendError("Email has been activated!");
        }
        req.user = user;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

AuthRequest.currentUserRequest = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.sendError("Not found User", 404);
        }
        req.user = user;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

module.exports = AuthRequest;
