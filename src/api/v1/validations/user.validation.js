const express = require("express");
const {
    requiredRule,
    isObjectId,
    phoneRule,
    genderRule,
    dateOfBirthRule,
} = require("../helpers/validation.helper");
const User = require("../models/user.model");

const UserRequest = express.Router();

UserRequest.getProfilePreviewRequest = async (req, res, next) => {
    const { id } = req.params;
    try {
        isObjectId(id);
        const user = await User.findById(id);
        if (!user) {
            return res.sendError("User not found", 404);
        }
        req.foundUser = user;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

UserRequest.getProfileRequest = async (req, res, next) => {
    const { id } = req.params;
    try {
        isObjectId(id);
        if (req.userId !== id) {
            return res.sendError("Not permission", 403);
        }
        const user = await User.findById(id);
        if (!user) {
            return res.sendError("User not found", 404);
        }
        req.foundUser = user;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

UserRequest.changeProfileInformationRequest = async (req, res, next) => {
    const { id } = req.params;
    if (req.userId !== id) {
        return res.sendError("Not permission", 403);
    }
    const { fullName, phone, gender, dateOfBirth } = req.body;
    try {
        requiredRule(fullName, "fullName");
        phone && phoneRule(phone);
        gender && genderRule(gender);
        dateOfBirth && dateOfBirthRule(dateOfBirth);
        const user = await User.findById(id);
        if (!user) {
            return res.sendError("User not found", 404);
        }
        req.foundUser = user;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

module.exports = UserRequest;
