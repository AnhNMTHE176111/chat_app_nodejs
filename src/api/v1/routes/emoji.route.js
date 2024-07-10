const express = require('express');
const router = express.Router();
const EmojiController = require('../controllers/emoji.controller');

router.post('/add/emojis', EmojiController.createEmoji);
router.get('/emojis', EmojiController.getAllEmojis);
router.get('/emojis/:id', EmojiController.getEmojiById);
router.put('/emojis/:id', EmojiController.updateEmoji);
router.delete('/emojis/:id', EmojiController.deleteEmoji);

module.exports = router;
