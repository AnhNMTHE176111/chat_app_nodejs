// blocker_id blocked_id
const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
    blocker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    blocked_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Block = mongoose.model("Block", blockSchema);

module.exports = Block;
