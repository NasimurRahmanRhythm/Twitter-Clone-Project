const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  bio: String,
  email: { type: String, unique: true },
  emailVerified: Date,
  image: String,
  coverImage: String,
  profileImage: String,
  hashedPassword: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  followingIds: [{ type: mongoose.Schema.Types.ObjectId }],
  hasNotification: Boolean,
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
