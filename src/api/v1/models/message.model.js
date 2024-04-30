const { default: mongoose } = require("mongoose");

const MessageSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    conversation_id: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    content: {
        type: String,
    },
    messageType: {
        type: String,
        enum: ["text", "voice", "image", "file"],
        default: "text",
    },
    attachment: {
        type: String,
    },
    readBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});

const Message = mongoose.model("Message", MessageSchema);
exports.module = Message;
