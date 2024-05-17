const { default: mongoose, Schema } = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    type: {
        type: String,
        trim: true,
        enum: ["single", "group"],
        required: true,
    },
},
{
    timestamps: true,
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
