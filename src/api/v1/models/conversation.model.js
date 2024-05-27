const { default: mongoose, Schema } = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    {
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
        picture: {
            type: String,
            trim: true,
        },
        notificationSettings: {
            type: {
                status: {
                    type: String,
                    enum: ["on", "off"],
                    default: "on",
                },
                duration: {
                    type: String,
                    enum: [
                        "5 minutes",
                        "1 hour",
                        "8 hours",
                        "until turned back on",
                    ],
                },
            },
            default: {
                status: "on",
            },
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
