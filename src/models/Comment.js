const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  body: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
});

module.exports =
  mongoose.models.comments || mongoose.model("comments", CommentSchema);
