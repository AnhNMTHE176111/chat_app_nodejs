const mongoose = require("mongoose");
const {
    GROUP_CONVERSATION,
    SINGLE_CONVERSATION,
    NOTIFICATION_OFF,
    NOTIFICATION_ON,
} = require("../helpers/const");
const Schema = mongoose.Schema;

const ConversationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            trim: true,
            enum: [SINGLE_CONVERSATION, GROUP_CONVERSATION],
            default: SINGLE_CONVERSATION,
        },
        picture: {
            type: String,
            trim: true,
        },
        notificationSettings: {
            type: {
                status: {
                    type: String,
                    enum: [NOTIFICATION_ON, NOTIFICATION_OFF],
                    default: NOTIFICATION_ON,
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
                status: NOTIFICATION_ON,
                duration: null,
            },
        },
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

ConversationSchema.path('notificationSettings').schema.set('_id', false);
const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
