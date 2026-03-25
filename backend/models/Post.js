const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String },
  imageUrl: { type: String },
  likes: [{ type: String }],
  comments: [{
    username: { type: String },
    text: { type: String },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);