const { default: mongoose, Schema } = require("mongoose");

const GroupSchema = new mongoose.Schema(
    {
        conversation_id: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        admin: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        creator_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        participants_id: [
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

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
