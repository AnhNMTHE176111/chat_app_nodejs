const { default: mongoose, Schema } = require("mongoose");

const DeletedConversationSchema = new mongoose.Schema({
    conversation_id: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

const DeletedConversation = mongoose.model(
    "DeletedConversation",
    DeletedConversationSchema
);
module.exports = DeletedConversation;
