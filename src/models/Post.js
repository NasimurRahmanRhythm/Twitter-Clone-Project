const mongoose = require("mongoose");
const Comment = require("./Comment");

const PostSchema = new mongoose.Schema({
  body: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  likedIds: [{ type: mongoose.Schema.Types.ObjectId }],
  image: String,
  comments: [Comment.schema],
});

module.exports = mongoose.models.posts || mongoose.model("posts", PostSchema);
