const Emoji = require('../models/emoji.model');

class EmojiService {
  static async createEmoji(data) {
    const emoji = new Emoji(data);
    return await emoji.save();
  }

  static async getAllEmojis() {
    return await Emoji.find();
  }

  static async getEmojiById(id) {
    return await Emoji.findById(id);
  }

  static async updateEmoji(id, data) {
    return await Emoji.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteEmoji(id) {
    return await Emoji.findByIdAndDelete(id);
  }
}

module.exports = EmojiService;
