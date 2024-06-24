const Message = require("../models/message.model");
const { io, onlineUsers, getSocketId } = require("../socket/socket");

const messageRouter = require("express").Router();

/** POST api/v1/message/send/:conversation_id */
messageRouter.post("/send/:conversation_id", async (req, res) => {
    // thực hiện chức năng nếu có file thì sẽ upload file vào firebase ở đây
    const {
        content,
        receiver,
        messageType,
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
            messageType: messageType,
            attachmentLink: attachmentLink,
            attachmentName: attachmentName,
            attachmentSize: attachmentSize,
        });

        await newMessage.populate("sender_id", "fullName avatar");
        receiver.map((receiver) => {
            const receiverSocketId = getSocketId(receiver._id.toString());
            io.to(receiverSocketId).emit("new-message", { newMessage });
        });

        return res.sendSuccess(newMessage, "New Message", 201);
    } catch (error) {
        console.log(error);
        return res.sendError("Send message fail");
    }
});

module.exports = messageRouter;
