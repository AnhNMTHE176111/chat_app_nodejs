const Message = require("../models/message.model");
const { io, onlineUsers, getSocketId } = require("../socket/socket");

const messageRouter = require("express").Router();

/** POST api/v1/message/send/:conversation_id */
messageRouter.post("/send/:conversation_id", async (req, res) => {
    const { content, receiver } = req.body;
    try {
        const newMessage = await Message.create({
            sender_id: req.userId,
            conversation_id: req.params.conversation_id,
            content: content,
        });
        await newMessage.populate("sender_id", "fullName avatar");
        console.log("receiver", receiver);
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
