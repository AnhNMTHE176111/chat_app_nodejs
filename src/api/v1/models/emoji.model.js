const mongoose = require('mongoose');

const emojiSchema = new mongoose.Schema({
  emoji: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Emoji', emojiSchema);
