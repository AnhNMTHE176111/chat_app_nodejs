const { default: mongoose, Schema } = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["single", "group"],
        required: true,
    },
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
