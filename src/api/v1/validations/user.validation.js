const express = require("express");
const {
    requiredRule,
    isObjectId,
    phoneRule,
    genderRule,
    dateOfBirthRule,
    friendStatusRule,
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

UserRequest.getFriendsRequest = async (req, res, next) => {
    const { id } = req.params;
    try {
        isObjectId(id);
        if (req.userId !== id) {
            return res.sendError("Not permission", 403);
        }
        const user = await User.findById(id).populate("friends.friend_id");
        if (!user) {
            return res.sendError("No friends", 404);
        }
        req.foundUser = user;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

UserRequest.changeFriendStatusRequest = async (req, res, next) => {
    const { id } = req.params;
    const { friendId, status } = req.body;
    try {
        isObjectId(id);
        isObjectId(friendId);
        friendStatusRule(status);
        if (req.userId !== id) {
            return res.sendError("Not permission", 403);
        }
        const users = await User.find({ _id: { $in: [id, friendId] } });
        if (!users) {
            return res.sendError("User not found", 404);
        }
        req.foundUser = users;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

UserRequest.findByEmailRequest = async (req, res, next) => {
    const { email } = req.params;
    const userId = req.userId;
    try {
        requiredRule(email, "email");
        const user = await User.find(
            {
                email,
                $or: [
                    { "friends.friend_id": { $ne: userId } },
                    { "friends.status": "reject", "friends.friend_id": userId },
                ],
            },
            { id: 1, avatar: 1, fullName: 1 }
        );
        if (!user) {
            return res.sendError("User not found", 404);
        }
        req.foundUser = user;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

UserRequest.addFriendRequest = async (req, res, next) => {
    const { id } = req.params;
    const { friendId } = req.body;
    try {
        isObjectId(id);
        isObjectId(friendId);
        if (req.userId !== id) {
            return res.sendError("Not permission", 403);
        }
        const users = await User.find({
            _id: { $in: [id, friendId] },
        });
        if (users.length !== 2) {
            return res.sendError("User not found", 404);
        }
        req.foundUsers = users;
    } catch (error) {
        return res.sendError(error?.message);
    }
    next();
};

module.exports = UserRequest;
