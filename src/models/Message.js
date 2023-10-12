import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    messages: [
      {
        body: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        seen: { type: Boolean, default: false },
        originalMessage: { id: String, body: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    lastMessage: {
      body: String,
      sender: { type: Schema.Types.ObjectId, ref: "users" },
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.messages || mongoose.model("messages", MessageSchema);
