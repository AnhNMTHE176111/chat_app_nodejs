const express = require("express");
const { notifyFriendStatusChange } = require("../../socket/socket");
const User = require("../../models/user.model");
const UserController = express.Router();

UserController.getProfilePreview = async (req, res) => {
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
            },
            "Get profile success"
        );
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

UserController.getFriends = async (req, res) => {
    try {
        const foundUser = req.foundUser;
        const friends = foundUser.friends
            .filter((friend) => friend.status === "accept")
            .map((friend) => ({
                id: friend.friend_id._id,
                fullName: friend.friend_id.fullName,
                avatar: friend.friend_id.avatar,
                sender_id: friend.sender_id,
            }));
        return res.sendSuccess(friends, "Get friends success");
    } catch (error) {
        return res.sendError(error?.message);
    }
};

UserController.getFriendsRequestList = async (req, res) => {
    try {
        const foundUser = req.foundUser;
        const friends = foundUser?.friends
            ?.filter((friend) => friend.status === "pending")
            ?.map((friend) => ({
                id: friend.friend_id._id,
                fullName: friend.friend_id.fullName,
                avatar: friend.friend_id.avatar,
                senderId: friend.sender_id,
            }));
        return res.sendSuccess(friends, "Get friends success");
    } catch (error) {
        return res.sendError(error?.message);
    }
};

UserController.findByEmail = async (req, res) => {
    try {
        const foundUser = req.foundUser;
        const users = foundUser.map((user) => ({
            id: user._id,
            fullName: user.fullName,
            avatar: user.avatar,
        }));
        return res.sendSuccess(users, "Get user success");
    } catch (error) {
        return res.sendError(error?.message);
    }
};

const updateFriendList = async (id, friendId, status, foundUsers) => {
    await Promise.all(
        foundUsers.map(async (user) => {
            const isSelf = user._id.toString() === id;
            const friendIdentifier = isSelf ? friendId : id;
            const friendIndex = user.friends.findIndex(
                (friend) => friend.friend_id.toString() === friendIdentifier
            );
            if (friendIndex !== -1) {
                user.friends[friendIndex].status = status;
            } else {
                user.friends.push({
                    friend_id: friendIdentifier,
                    status: status,
                    sender_id: id,
                });
            }

            await user.save();
        })
    );
};

UserController.changeFriendStatus = async (req, res) => {
    const { id } = req.params;
    const { friendId, status } = req.body;
    const foundUsers = req.foundUser;

    try {
        await updateFriendList(id, friendId, status, foundUsers);
        notifyFriendStatusChange(id);
        notifyFriendStatusChange(friendId);
        return res.updateSuccess();
    } catch (error) {
        return res.sendError(error?.message);
    }
};

UserController.addFriend = async (req, res) => {
    const { id } = req.params;
    const { friendId } = req.body;
    const status = "pending";
    const foundUsers = req.foundUsers;

    try {
        await updateFriendList(id, friendId, status, foundUsers);
        notifyFriendStatusChange(id);
        notifyFriendStatusChange(friendId);
        return res.updateSuccess();
    } catch (error) {
        return res.sendError(error?.message);
    }
};

UserController.getFriendById = async (req, res) => {
    try {
        const { id } = req.params;
        const foundUser = await User.findById(req.userId);
        const friend = foundUser.friends.find(
            (friend) => friend.friend_id.toString() === id
        );
        if (!friend) {
            return res.sendError(null, "Friend not found");
        }
        return res.sendSuccess(friend, "Get friend success");
    } catch (error) {
        return res.sendError(error?.message);
    }
};

module.exports = UserController;
