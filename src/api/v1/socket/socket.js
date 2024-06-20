const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { CLIENT_URL } = require("../helpers/const");
const Message = require("../models/message.model");

const app = express();
const server = http.createServer(app);
const io = new socket.Server(server, {
    cors: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
});

/**
 * onlineUsers: Map
 *
 * key: user_id
 * value: socket_id
 */
const onlineUsers = new Map();

const getSocketId = (userId) => {
    return onlineUsers.get(userId);
};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("join-room", (conversationId) => {
        console.log(`${socket.handshake.query.id} join room ${conversationId}`);
        socket.join(conversationId);
    });
    socket.on("leave-room", (conversationId) => {
        console.log(
            `${socket.handshake.query.id} leave room ${conversationId}`
        );
        socket.leave(conversationId);
    });

    socket.on("read-message", async (data) => {
        try {
            await Message.findByIdAndUpdate(data.messageId, {
                $addToSet: { readBy: data.userId },
            });
            await Message.updateMany(
                {
                    conversation_id: data.conversation_id,
                    createdAt: { $lte: data.createdAt },
                    readBy: { $nin: [data.userId] },
                },
                { $addToSet: { readBy: data.userId } }
            );
        } catch (error) {
            console.error("Error updating messages:", error);
        }
    });

    onlineUsers.set(socket.handshake.query.id, socket.id);
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    socket.on("disconnect", (reason) => {
        console.log(`Socket ${socket.id} disconnected due to ${reason}`);
        onlineUsers.delete(socket.handshake.query.id);
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
});

module.exports = {
    app,
    server,
    io,
    onlineUsers,
    getSocketId,
};
