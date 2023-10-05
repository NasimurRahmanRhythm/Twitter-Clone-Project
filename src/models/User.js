import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  username: { type: String , unique: true},
  bio: String,
  email: { type: String , unique: true},
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  coverImage: String,
  profileImage: String,
  hashedPassword: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  followingIds: [{ type: mongoose.Schema.Types.ObjectId , ref: "users" }],
  followerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "users"}],
  hasNotification: Boolean,
});

module.exports = mongoose.models.users || mongoose.model("users", UserSchema);
