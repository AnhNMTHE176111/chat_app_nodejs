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

const conversationRouter = require("express").Router();

/** POST api/v1/conversation/single */
conversationRouter.post("/single", async (req, res) => {
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
});

/** POST api/v1/conversation/group */
conversationRouter.post("/group", async (req, res) => {
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
});

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

/** GET api/v1/conversation/:conversation_id/messages */
conversationRouter.get("/:conversation_id/messages", async (req, res) => {
    const data = await Message.find({
        conversation_id: req.params.conversation_id,
    })
        .sort({ createdAt: -1 })
        .limit(15)
        .populate("sender_id", "fullName avatar");
    data.sort((a, b) => a.createdAt - b.createdAt);

    return res.sendSuccess(
        data,
        `Get all messages of conversation ${req.params.conversation_id}`
    );
});

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
