const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  body: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likedIds: [{ type: mongoose.Schema.Types.ObjectId }],
  image: String,
});

module.exports = mongoose.models.Post || mongoose.model("Post", PostSchema);
