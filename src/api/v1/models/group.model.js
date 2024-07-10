const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new mongoose.Schema(
    {
        conversation: {
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
    },
    {
        timestamps: true,
    }
);

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
