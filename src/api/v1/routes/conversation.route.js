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
        .limit(20)
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

module.exports = conversationRouter;
