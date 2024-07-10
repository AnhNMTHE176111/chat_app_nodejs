const EmojiService = require('../services/emoji.service');

class EmojiController {
  static async createEmoji(req, res) {
    try {
      const emoji = await EmojiService.createEmoji(req.body);
      res.status(201).json(emoji);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllEmojis(req, res) {
    try {
      const emojis = await EmojiService.getAllEmojis();
      res.status(200).json(emojis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getEmojiById(req, res) {
    try {
      const emoji = await EmojiService.getEmojiById(req.params.id);
      if (emoji) {
        res.status(200).json(emoji);
      } else {
        res.status(404).json({ message: 'Emoji not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateEmoji(req, res) {
    try {
      const emoji = await EmojiService.updateEmoji(req.params.id, req.body);
      if (emoji) {
        res.status(200).json(emoji);
      } else {
        res.status(404).json({ message: 'Emoji not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteEmoji(req, res) {
    try {
      const emoji = await EmojiService.deleteEmoji(req.params.id);
      if (emoji) {
        res.status(200).json({ message: 'Emoji deleted successfully' });
      } else {
        res.status(404).json({ message: 'Emoji not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = EmojiController;
