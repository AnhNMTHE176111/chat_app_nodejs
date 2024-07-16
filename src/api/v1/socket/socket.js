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

const notifyFriendStatusChange = (userId) => {
    io.emit("friendStatusChanged", userId);
};

/**
 * onlineUsers: Map
 *
 * key: user_id
 * value: [socket_id]
 */
const onlineUsers = new Map();

const getSocketId = (userId) => {
    return onlineUsers.get(userId);
};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.id;
    if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).add(socket.id);
    } else {
        const socketIdSet = new Set();
        socketIdSet.add(socket.id);
        socketIdSet.forEach((item) => {});

        onlineUsers.set(socket.handshake.query.id, socketIdSet);
    }
    io.emit(SOCKET_EVENT.GET_ONLINE_USERS, Array.from(onlineUsers.keys()));

    socket.on(SOCKET_EVENT.SOCKET_DISCONNECT, (reason) => {
        console.log(`Socket ${socket.id} disconnected due to ${reason}`);
        const userId = socket.handshake.query.id;
        const socketIdSet = onlineUsers.get(userId);
        socketIdSet.delete(socket.id);
        if (socketIdSet.size == 0) {
            onlineUsers.delete(userId);
        }
        io.emit(SOCKET_EVENT.GET_ONLINE_USERS, Array.from(onlineUsers.keys()));
    });

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
            const { conversation } = data;
            console.log("data", conversation.participants);
            console.log("data.messageId", data.messageId);
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
            await message.populate([
                { path: "sender_id", select: "fullName avatar" },
                {
                    path: "thread",
                    select: "sender_id content messageType",
                },
            ]);

            conversation.participants.map((participant) => {
                // if (participant._id != socket.handshake.query.id) {
                const participantSocketId = getSocketId(
                    participant._id.toString()
                );
                participantSocketId?.forEach((item) => {
                    if (item != socket.id) {
                        io.to(item).emit(SOCKET_EVENT.REACT_MESSAGE, {
                            message: message,
                        });
                    }
                });
                // }
            });
        } catch (error) {
            console.error("Error react messages:", error);
        }
    });

    socket.on(SOCKET_EVENT.DELETE_MESSAGE, async (data) => {
        try {
            const { message, isMyMessage, hiddenFor, receiver, conversation } =
                data;
            if (isMyMessage) {
                await Message.findByIdAndDelete(message._id);
                receiver.map((receiver) => {
                    const receiverSocketId = getSocketId(
                        receiver._id.toString()
                    );
                    receiverSocketId.forEach((item) => {
                        io.to(item).emit(SOCKET_EVENT.DELETED_MESSAGE, {
                            message,
                        });
                    });
                });
            } else {
                const messageUpdated = await Message.findByIdAndUpdate(
                    message._id,
                    {
                        $addToSet: {
                            hiddenFor: hiddenFor,
                        },
                    },
                    {
                        new: true,
                    }
                );
                await messageUpdated.populate([
                    { path: "sender_id", select: "fullName avatar" },
                    {
                        path: "thread",
                        select: "sender_id content messageType",
                    },
                ]);

                conversation.participants.map((participant) => {
                    if (participant._id == socket.handshake.query.id) {
                        const participantSocketId = getSocketId(
                            participant._id.toString()
                        );
                        participantSocketId?.forEach((item) => {
                            if (item != socket.id) {
                                io.to(item).emit(SOCKET_EVENT.DELETED_MESSAGE, {
                                    message: messageUpdated,
                                });
                            }
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Error delete message:", error);
        }
    });

    socket.on(SOCKET_EVENT.START_CALL, ({ offer, conversation, hasVideo }) => {
        conversation.participants.map((participant) => {
            if (participant._id != socket.handshake.query.id) {
                const participantSocketId = getSocketId(
                    participant._id.toString()
                );
                participantSocketId?.forEach((item) => {
                    io.to(item).emit(SOCKET_EVENT.RECEIVE_CALL, {
                        offer: offer,
                        conversation: conversation,
                        hasVideo: hasVideo,
                    });
                });
            }
        });
        socket.join(conversation.id);
    });

    socket.on(SOCKET_EVENT.CANDIDATE, ({ candidate, conversation }) => {
        conversation.participants.map((participant) => {
            if (participant._id != socket.handshake.query.id) {
                const participantSocketId = getSocketId(
                    participant._id.toString()
                );
                participantSocketId?.forEach((item) => {
                    io.to(item).emit(SOCKET_EVENT.CANDIDATE, {
                        candidate: candidate,
                        conversation: conversation,
                    });
                });
            }
        });
        socket.join(conversation.id);
    });

    socket.on(SOCKET_EVENT.MAKE_ANSWER, ({ answer, conversation }) => {
        conversation.participants.map((participant) => {
            if (participant._id != socket.handshake.query.id) {
                const participantSocketId = getSocketId(
                    participant._id.toString()
                );
                participantSocketId?.forEach((item) => {
                    io.to(item).emit(SOCKET_EVENT.ANSWER_MADE, {
                        answer: answer,
                        socketId: participant._id,
                    });
                });
            }
            if (participant._id == socket.handshake.query.id) {
                const participantSocketId = getSocketId(
                    participant._id.toString()
                );
                participantSocketId?.forEach((item) => {
                    io.to(item).emit(SOCKET_EVENT.ALREADY_MADE_ANSWER, {
                        answer: answer,
                        socketId: participant._id,
                    });
                });
            }
        });
        socket.join(conversation.id);
    });

    socket.on(SOCKET_EVENT.END_CALL, ({ conversation }) => {
        conversation.participants.map((participant) => {
            const participantSocketId = getSocketId(participant._id.toString());
            participantSocketId?.forEach((item) => {
                io.to(item).emit(SOCKET_EVENT.END_CALL, {
                    conversation,
                });
            });
        });
        socket.leave(conversation.id);
    });

    socket.on(SOCKET_EVENT.IS_IN_ANOTHER_CALL, ({ conversation }) => {
        conversation.participants.map((participant) => {
            if (participant._id != socket.handshake.query.id) {
                const participantSocketId = getSocketId(
                    participant._id.toString()
                );
                participantSocketId?.forEach((item) => {
                    io.to(item).emit(SOCKET_EVENT.IS_IN_ANOTHER_CALL, {
                        conversation,
                    });
                });
            }
        });
        socket.leave(conversation.id);
    });
});

//   socket.on(SOCKET_EVENT.JOIN_ROOM, (conversationId) => {
//     console.log(`${userId} join room ${conversationId}`);
//     socket.join(conversationId);
//     socket.to(conversationId).emit(SOCKET_EVENT.PARTICIPANT_JOINED, userId);
//   });

//   socket.on(SOCKET_EVENT.LEAVE_ROOM, (conversationId) => {
//     console.log(`${userId} leave room ${conversationId}`);
//     socket.leave(conversationId);
//     socket.to(conversationId).emit(SOCKET_EVENT.PARTICIPANT_LEFT, userId);
//   });

//   socket.on(SOCKET_EVENT.CALL_USER, ({ offer, to }) => {
//     const socketId = getSocketId(to);
//     if (socketId) {
//       io.to(socketId).emit(SOCKET_EVENT.CALL_MADE, { offer, socketId: socket.id });
//     }
//   });

//   socket.on(SOCKET_EVENT.MAKE_ANSWER, ({ answer, to }) => {
//     const socketId = getSocketId(to);
//     if (socketId) {
//       io.to(socketId).emit(SOCKET_EVENT.ANSWER_MADE, { answer, socketId: socket.id });
//     }
//   });

//   socket.on(SOCKET_EVENT.CANDIDATE, ({ candidate, to }) => {
//     const socketId = getSocketId(to);
//     if (socketId) {
//       io.to(socketId).emit(SOCKET_EVENT.CANDIDATE, { candidate, socketId: socket.id });
//     }
//   });

module.exports = {
    app,
    server,
    io,
    onlineUsers,
    getSocketId,
    notifyFriendStatusChange,
};
