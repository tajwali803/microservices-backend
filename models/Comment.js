const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  post_id: {
    type: String,
    required: [true, "User id is required"],
  },
	user_id: {
		type: String,
		required: [true, "User id is required"],
	},
	status: {
		type: String,
		required: [true, "Status is required"],
	}
});


const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment