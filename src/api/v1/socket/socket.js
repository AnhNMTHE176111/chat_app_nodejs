const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { CLIENT_URL, SOCKET_EVENT } = require("../helpers/const");
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

const notifyFriendStatusChange = (userId) => {
    io.emit("friendStatusChanged", userId);
};

const getSocketId = (userId) => {
    return onlineUsers.get(userId);
};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on(SOCKET_EVENT.SOCKET_CONNECTION, (conversationId) => {
        console.log(`${socket.handshake.query.id} join room ${conversationId}`);
        socket.join(conversationId);
    });
    socket.on(SOCKET_EVENT.JOIN_ROOM, (conversationId) => {
        console.log(
            `${socket.handshake.query.id} leave room ${conversationId}`
        );
        socket.leave(conversationId);
    });

    socket.on(SOCKET_EVENT.READ_MESSAGE, async (data) => {
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

    socket.on(SOCKET_EVENT.REACT_MESSAGE, async (data) => {
        try {
            const emoji = data.emoji;
            let message = await Message.findById(data.messageId);
            if (!message) {
                return console.log(`Not found message id ${data.messageId}`);
            }
            let reactionIndex = message.reaction.findIndex(
                (reaction) => reaction.emoji === emoji
            );
            if (reactionIndex === -1) {
                message.reaction.push({ emoji, count: 1 });
            } else {
                message.reaction[reactionIndex].count++;
            }
            await message.save();
        } catch (error) {
            console.error("Error react messages:", error);
        }
    });

    socket.on(SOCKET_EVENT.DELETE_MESSAGE, async (data) => {
        try {
            const { message, isMyMessage, hiddenFor, receiver } = data;
            if (isMyMessage) {
                await Message.findByIdAndDelete(message._id);
                receiver.map((receiver) => {
                    console.log("receiver", receiver);
                    const receiverSocketId = getSocketId(
                        receiver._id.toString()
                    );
                    console.log("receiverSocketId", receiverSocketId);
                    io.to(receiverSocketId).emit(SOCKET_EVENT.DELETED_MESSAGE, {
                        message,
                    });
                });
            } else {
                await Message.findByIdAndUpdate(message._id, {
                    $addToSet: {
                        hiddenFor: hiddenFor,
                    },
                });
            }
        } catch (error) {
            console.error("Error delete message:", error);
        }
    });

    onlineUsers.set(socket.handshake.query.id, socket.id);
    io.emit(SOCKET_EVENT.GET_ONLINE_USERS, Array.from(onlineUsers.keys()));

    socket.on(SOCKET_EVENT.SOCKET_DISCONNECT, (reason) => {
        console.log(`Socket ${socket.id} disconnected due to ${reason}`);
        onlineUsers.delete(socket.handshake.query.id);
        io.emit(SOCKET_EVENT.GET_ONLINE_USERS, Array.from(onlineUsers.keys()));
    });
});

module.exports = {
    app,
    server,
    io,
    onlineUsers,
    getSocketId,
    notifyFriendStatusChange,
};
