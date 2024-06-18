const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        conversation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        content: {
            type: String,
        },
        messageType: {
            type: String,
            trim: true,
            enum: ["text", "voice", "image", "file"],
            default: "text",
        },
        attachment: {
            type: String,
            trim: true,
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        reaction: [
            {
                emoji: {
                    type: String,
                    trim: true,
                },
                count: {
                    type: Number,
                    default: 0,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
