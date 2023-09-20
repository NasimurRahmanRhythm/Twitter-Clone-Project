const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  body: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
