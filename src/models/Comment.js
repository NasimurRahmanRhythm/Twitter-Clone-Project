const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  body: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

module.exports =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
