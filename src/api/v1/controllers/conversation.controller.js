const express = require("express");
const Conversation = require("../models/conversation.model");
const User = require("../models/user.model");
const { SINGLE_CONVERSATION, GROUP_CONVERSATION } = require("../helpers/const");
const mongoose = require("mongoose");
const Message = require("../models/message.model");
const Group = require("../models/group.model");
const { onlineUsers } = require("../socket/socket");

const ConversationController = express.Router();

ConversationController.getConversationsSingle = async (req, res) => {
    const userId = req.userId;
    const receiverId = req.body.receiverId;
    try {
        // let currentUser = await User.findById(userID);
        let receiver = await User.findById(receiverId);
        let conversation = await Conversation.findOne({
            type: SINGLE_CONVERSATION,
            participants: {
                $all: [userId, receiverId],
            },
        });

        if (conversation) {
            return res.sendSuccess(conversation, "Conversation already exist");
        }

        conversation = await Conversation.create({
            title: receiver.fullName,
            picture: receiver.avatar,
            participants: [userId, receiverId],
        });
        return res.sendSuccess(conversation, "Create new Conversation");
    } catch (error) {
        return res.sendError(error?.message);
    }
};

ConversationController.getConversationsGroup = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { participants, groupName } = req.body;
        participants.push(req.userId);
        const uniqueParticipants = [...new Set(participants)];
        const conversation = await Conversation.create(
            [
                {
                    title: groupName,
                    type: GROUP_CONVERSATION,
                    participants: uniqueParticipants,
                },
            ],
            {
                session: session,
            }
        );
        const group = await Group.create(
            [
                {
                    conversation: conversation[0]._id,
                    admin: req.userId,
                    creator_id: req.userId,
                },
            ],
            {
                session: session,
            }
        );
        const data = await group[0].populate("conversation");
        await session.commitTransaction();
        session.endSession();
        return res.sendSuccess(data, "Create New Group");
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.sendError(error?.message);
    }
};

ConversationController.getConversationsList = async (req, res) => {
    const userId = req.userId;
    const data = await Conversation.find({ participants: userId }).populate(
        "participants",
        "fullName avatar"
    );
    data.map((conversation) => {
        if (conversation.type == SINGLE_CONVERSATION) {
            const other = conversation.participants.filter(
                (user) => !user._id.equals(userId)
            )[0];
            conversation.picture = other.avatar;
            conversation.title = other.fullName;
        }
        if (conversation.type == GROUP_CONVERSATION) {
            conversation.title = "Group: " + conversation.title;
        }
        return conversation;
    });
    return res.sendSuccess(data, `Get All Conversation of User: ${userId}`);
};

ConversationController.getConversationById = async (req, res) => {
    const data = await Message.find({
        conversation_id: req.params.conversation_id,
    }).populate("sender_id", "fullName avatar");

    return res.sendSuccess(
        data,
        `Get all message of conversation ${req.params.conversation_id}`
    );
};

ConversationController.createSingleConversation = async (req, res) => {
    try {
        const { participants, type } = req.body;
        const otherUser = participants.filter(
            (item) => item._id != req.userId
        )[0];
        const conversations = await Conversation.findOne({
            type: type, //single
            participants: {
                $all: req.body.participants,
            },
        });
        if (conversations) {
            return res.sendSuccess(
                {
                    id: conversations._id,
                },
                "Conversation already exist"
            );
        }
        const createConversation = await Conversation.create({
            type: SINGLE_CONVERSATION,
            participants: participants,
            title: otherUser.fullName,
        });
        return res.sendSuccess(
            {
                id: createConversation._id,
            },
            "Create New Conversation"
        );
    } catch (error) {
        return res.sendError(error?.message);
    }
};

ConversationController.createGroupConversation = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { participants, title } = req.body;
        participants.push(req.userId);
        const uniqueParticipants = [...new Set(participants)];
        const conversation = await Conversation.create(
            [
                {
                    title: title,
                    type: GROUP_CONVERSATION,
                    participants: uniqueParticipants,
                },
            ],
            {
                session: session,
            }
        );
        const group = await Group.create(
            [
                {
                    conversation: conversation[0]._id,
                    admin: req.userId,
                    creator_id: req.userId,
                },
            ],
            {
                session: session,
            }
        );
        await session.commitTransaction();
        session.endSession();
        return res.sendSuccess(group, "Create New Group");
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.sendError(error?.message);
    }
};

module.exports = ConversationController;
