const express = require("express");
const User = require("../../models/user.model");
const UserController = express.Router();

UserController.getProfilePreview = async (req, res) => {
    const { id } = req.params;
    try {
        const foundUser = await User.findById(id);
        if (!foundUser) {
            return res.sendError("User not found", 404);
        } else {
            return res.sendSuccess(
                {
                    fullName: foundUser.fullName,
                    address: foundUser.address,
                    gender: foundUser.gender,
                    dateOfBirth: foundUser.dateOfBirth,
                    description: foundUser.description,
                    avatar: foundUser.avatar,
                    background: foundUser.background,
                },
                "Get profile success"
            );
        }
    } catch (error) {
        return res.sendError(error?.message);
    }
};

UserController.changeProfileInformation = async (req, res) => {
    const {
        fullName,
        address,
        gender,
        dateOfBirth,
        description,
        avatar,
        background,
        phone,
    } = req.body;
    try {
        const foundUser = req.foundUser;
        foundUser.fullName = fullName;
        foundUser.address = address;
        foundUser.gender = gender;
        foundUser.dateOfBirth = dateOfBirth;
        foundUser.description = description;
        foundUser.avatar = avatar;
        foundUser.background = background;
        foundUser.phone = phone;
        await foundUser.save();
        return res.updateSuccess();
    } catch (error) {
        return res.sendError(error?.message);
    }
};

UserController.getProfile = async (req, res) => {
    try {
        const foundUser = req.foundUser;
        return res.sendSuccess(
            {
                fullName: foundUser.fullName,
                address: foundUser.address,
                gender: foundUser.gender,
                dateOfBirth: foundUser.dateOfBirth,
                description: foundUser.description,
                avatar: foundUser.avatar,
                background: foundUser.background,
                phone: foundUser.phone,
            },
            "Get profile success"
        );
    } catch (error) {
        return res.sendError(error?.message);
    }
};

module.exports = UserController;
