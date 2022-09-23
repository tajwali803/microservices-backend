const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  user_id: {
    type: String,
    required: [true, "User id is required"],
  },
});


const Post = mongoose.model("Post", postSchema);

module.exports = Post