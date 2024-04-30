const { default: mongoose, Schema } = require("mongoose");

const DeletedMessageSchema = new mongoose.Schema({
    message_id: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

const DeletedMessage = mongoose.model("DeletedMessage", DeletedMessageSchema);
module.exports = DeletedMessage;
