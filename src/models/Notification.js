import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    type: String,
    content: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.notifications ||
  mongoose.model("notifications", NotificationSchema);
