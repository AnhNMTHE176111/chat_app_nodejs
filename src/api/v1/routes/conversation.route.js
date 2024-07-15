const { Mongoose, default: mongoose } = require("mongoose");
const {
    GROUP_CONVERSATION,
    SINGLE_CONVERSATION,
    MESSAGE_TYPE,
} = require("../helpers/const");
const Conversation = require("../models/conversation.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const Message = require("../models/message.model");
const { onlineUsers } = require("../socket/socket");
const ConversationController = require("../controllers/conversation.controller");

const conversationRouter = require("express").Router();

conversationRouter.post(
    "/single",
    ConversationController.getConversationsSingle
);

conversationRouter.post("/group", ConversationController.getConversationsGroup);

/** GET api/v1/conversation/list */
conversationRouter.get("/list", async (req, res) => {
    const userId = req.userId;

    let data = await Conversation.find({
        participants: userId,
    }).populate("participants", "fullName avatar");

    for (let conversation of data) {
        conversation._doc.latestMessage = await Message.findOne({
            conversation_id: conversation._id,
        })
            .sort({ createdAt: -1 })
            .populate("sender_id", "fullName avatar");

        if (conversation.type === SINGLE_CONVERSATION) {
            const other = conversation.participants.filter(
                (user) => !user._id.equals(userId)
            )[0];
            conversation.picture = other.avatar;
            conversation.title = other.fullName;
        }
    }

    data.sort((a, b) => {
        if (a._doc.latestMessage && b._doc.latestMessage) {
            return (
                b._doc.latestMessage.createdAt - a._doc.latestMessage.createdAt
            );
        }
    });

    return res.sendSuccess(data, `Get All Conversation of User: ${userId}`);
});

/** GET api/v1/conversation/:conversation_id */
conversationRouter.get("/:conversation_id", async (req, res) => {
    const userId = req.userId;
    let data = await Conversation.findById(req.params.conversation_id).populate(
        "participants",
        "fullName avatar"
    );

    data._doc.latestMessage = await Message.findOne({
        conversation_id: req.params.conversation_id,
    })
        .sort({ createdAt: -1 })
        .populate("sender_id", "fullName avatar");

    if (data.type === SINGLE_CONVERSATION) {
        const other = data.participants.filter(
            (user) => !user._id.equals(userId)
        )[0];
        data.picture = other.avatar;
        data.title = other.fullName;
    }

    return res.sendSuccess(
        data,
        `Get Conversation with conversation_id: ${userId}`
    );
});

/** GET api/v1/conversation/:conversation_id/messages */
conversationRouter.get("/:conversation_id/messages", async (req, res) => {
    const data = await Message.find({
        conversation_id: req.params.conversation_id,
    })
        .sort({ createdAt: -1 })
        .limit(15)
        .populate("sender_id", "fullName avatar")
        .populate("thread", "sender_id content messageType");
    data.sort((a, b) => a.createdAt - b.createdAt);

    return res.sendSuccess(
        data,
        `Get all messages of conversation ${req.params.conversation_id}`
    );
});
conversationRouter.post(
    "/create-single-conversation",
    ConversationController.createSingleConversation
);
conversationRouter.post(
    "/create-group-conversation",
    ConversationController.createGroupConversation
);

/** GET api/v1/conversation/:conversation_id/medias */
conversationRouter.get("/:conversation_id/medias", async (req, res) => {
    const data = await Message.find({
        conversation_id: req.params.conversation_id,
        messageType: MESSAGE_TYPE.IMAGE,
    })
        .sort({ createdAt: -1 })
        .populate("sender_id", "fullName avatar");
    data.sort((a, b) => a.createdAt - b.createdAt);

    return res.sendSuccess(
        data,
        `Get all messages of conversation ${req.params.conversation_id}`
    );
});

/** GET api/v1/conversation/:conversation_id/files */
conversationRouter.get("/:conversation_id/files", async (req, res) => {
    const data = await Message.find({
        conversation_id: req.params.conversation_id,
        messageType: MESSAGE_TYPE.FILE,
    })
        .sort({ createdAt: -1 })
        .populate("sender_id", "fullName avatar");
    data.sort((a, b) => a.createdAt - b.createdAt);

    return res.sendSuccess(
        data,
        `Get all messages of conversation ${req.params.conversation_id}`
    );
});

/** GET api/v1/conversation/:conversation_id/messages/loadmore?before=.....*/
conversationRouter.get(
    "/:conversation_id/messages/loadmore",
    async (req, res) => {
        try {
            const date = new Date(req.query.before);
            console.log("date", date);
            const data = await Message.find({
                $and: [
                    {
                        conversation_id: req.params.conversation_id,
                    },
                    {
                        createdAt: { $lt: date },
                    },
                ],
            })
                .sort({ createdAt: -1 })
                .limit(15)
                .populate("sender_id", "fullName avatar");

            data.sort((a, b) => a.createdAt - b.createdAt);

            return res.sendSuccess(
                data,
                `Load more messages of conversation ${req.params.conversation_id}`
            );
        } catch (error) {
            console.log("error", error);
            return res.sendError("Load more messages fail");
        }
    }
);

conversationRouter.post("/:conversation_id/add-friend", async (req, res) => {
    try {
        const friendList = req.body.friendList;
        const data = await Conversation.findOneAndUpdate(
            { _id: req.params.conversation_id },
            { $push: { participants: friendList } }
        );
        return res.sendSuccess(data, "Add friend success");
    } catch (error) {
        return res.sendError(error?.message);
    }
});

conversationRouter.get("/:conversation_id/members", async (req, res) => {
    try {
        const { conversation_id } = req.params;
        if (!conversation_id) {
            return res.sendError("Conversation id not found");
        }
        const conversation = await Conversation.findById(
            conversation_id
        ).populate("participants", "fullName avatar");
        if (!conversation) {
            return res.sendError("Conversation not found");
        }
        const foundGroup = await Group.findOne({
            conversation: conversation_id,
        });
        if (!foundGroup) {
            return res.sendError("Group not found");
        }
        return res.sendSuccess(
            {
                memberList: conversation.participants,
                admin: foundGroup.admin,
                conversationId: conversation_id,
            },
            "Get members success"
        );
    } catch (error) {
        return res.sendError(error?.message);
    }
});

conversationRouter.post(
    "/:conversation_id/:member_id/:newRole/update-role",
    async (req, res) => {
        try {
            const { conversation_id, member_id, newRole } = req.params;
            if (!conversation_id) {
                return res.sendError("Conversation id not found");
            }
            if (!member_id) {
                return res.sendError("Member id not found");
            }
            if (!newRole) {
                return res.sendError("New role not found");
            }
            const conversation = await Conversation.findById(conversation_id);
            if (!conversation) {
                return res.sendError("Conversation not found");
            }
            const foundGroup = await Group.findOne({
                conversation: conversation_id,
            });
            if (!foundGroup) {
                return res.sendError("Group not found");
            }

            if (!conversation.participants.includes(member_id)) {
                return res.sendError("Member not found");
            }
            if (foundGroup.admin.includes(req.userId)) {
                if (req.userId.toString() === member_id.toString()) {
                    if (newRole === "admin") {
                        return res.sendError("You are already admin");
                    }
                    if (foundGroup.admin.length > 1) {
                        await foundGroup.updateOne({
                            $pull: {
                                admin: member_id,
                            },
                        });
                    } else {
                        return res.sendError(
                            null,
                            "You can't remove last admin"
                        );
                    }
                } else {
                    if (foundGroup.admin.includes(member_id)) {
                        return res.sendError("You can't remove admin");
                    }
                    if (newRole === "admin") {
                        await foundGroup.updateOne({
                            $push: {
                                admin: member_id,
                            },
                        });
                    }
                }
            } else {
                return res.sendError(
                    null,
                    "You don't have permission to update role"
                );
            }
            return res.sendSuccess(null, "Update role success");
        } catch (error) {
            return res.sendError(error?.message);
        }
    }
);

conversationRouter.post("/:conversation_id/leave", async (req, res) => {
    try {
        const { conversation_id } = req.params;
        if (!conversation_id) {
            return res.sendError("Conversation id not found");
        }
        const foundConversation = await Conversation.findById(conversation_id);
        if (!foundConversation) {
            return res.sendError("Conversation not found");
        }
        const foundGroup = await Group.findOne({
            conversation: conversation_id,
        });
        if (!foundGroup) {
            return res.sendError("Group not found");
        }
        if (foundGroup.admin.toString() === req.userId.toString()) {
            if (foundGroup.admin.length > 1) {
                await foundGroup.updateOne({
                    $pull: {
                        admin: req.userId,
                    },
                });
            } else {
                return res.sendError(
                    null,
                    "You can't leave group with only 1 admin"
                );
            }
        }
        await foundConversation.updateOne({
            $pull: {
                participants: req.userId,
            },
        });
        return res.sendSuccess(null, "Leave group success");
    } catch (error) {
        return res.sendError(error?.message);
    }
});

conversationRouter.post(
    "/:conversation_id/:member_id/kick",
    async (req, res) => {
        try {
            const { conversation_id, member_id } = req.params;
            if (!conversation_id) {
                return res.sendError("Conversation id not found");
            }
            const foundConversation = await Conversation.findById(
                conversation_id
            );
            if (!foundConversation) {
                return res.sendError("Conversation not found");
            }
            const foundGroup = await Group.findOne({
                conversation: conversation_id,
            });
            if (!foundGroup) {
                return res.sendError("Group not found");
            }
            if (foundGroup.admin.toString() !== req.userId.toString()) {
                return res.sendError("You are not admin");
            }
            if (foundGroup.admin.toString() === member_id.toString()) {
                return res.sendError("You can't kick admin");
            }
            await foundConversation.updateOne({
                $pull: {
                    participants: member_id,
                },
            });
            return res.sendSuccess(null, "Kick member success");
        } catch (error) {
            return res.sendError(error?.message);
        }
    }
);

module.exports = conversationRouter;
