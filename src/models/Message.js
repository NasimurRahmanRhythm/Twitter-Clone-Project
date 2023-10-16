import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    messages: [
      {
        content: {
          text: String,
          file: String,
        },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        seen: { type: Boolean, default: false },
        originalMessage: {
          id: String,
          text: String,
          file: String,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    lastMessage: {
      text: String,
      file: String,
      sender: { type: Schema.Types.ObjectId, ref: "users" },
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.messages || mongoose.model("messages", MessageSchema);
