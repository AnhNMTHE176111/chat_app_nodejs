const Message = require("../models/message.model");
const { io, onlineUsers, getSocketId } = require("../socket/socket");

const messageRouter = require("express").Router();

/** POST api/v1/message/send/:conversation_id */
messageRouter.post("/send/:conversation_id", async (req, res) => {
    const {
        content,
        receiver,
        messageType,
        thread,
        attachmentLink,
        attachmentName,
        attachmentSize,
    } = req.body;
    try {
        const newMessage = await Message.create({
            sender_id: req.userId,
            conversation_id: req.params.conversation_id,
            content: content,
            readBy: [req.userId],
            thread: thread,
            messageType: messageType,
            attachmentLink: attachmentLink,
            attachmentName: attachmentName,
            attachmentSize: attachmentSize,
        });

        await newMessage.populate([
            { path: "sender_id", select: "fullName avatar" },
            {
                path: "thread",
                select: "sender_id content messageType",
            },
        ]);
        receiver.map((receiver) => {
            const receiverSocketId = getSocketId(receiver._id.toString());
            receiverSocketId.forEach((item) => {
                io.to(item).emit("new-message", { newMessage });
            });
        });

        return res.sendSuccess(newMessage, "New Message", 201);
    } catch (error) {
        console.log(error);
        return res.sendError("Send message fail");
    }
});

module.exports = messageRouter;
