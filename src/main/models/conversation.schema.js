import { CONVERSATION_SCHEMA, USER_SCHEMA } from "@/constants";
import mongoose, { models, model, Schema, SchemaTypes } from "mongoose";

const conversationSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: USER_SCHEMA,
      },
    ],
    messages: [
      {
        content: {
          text: String,
          file: String,
        },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: USER_SCHEMA,
        },
        receiver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: USER_SCHEMA,
        },
        senderReact: {
          type: String,
          enum: ["none", "like", "haha", "love", "sad", "angry"],
          default: "none",
        },
        receiverReact: {
          type: String,
          enum: ["none", "like", "haha", "love", "sad", "angry"],
          default: "none",
        },
        seen: {
          type: Boolean,
          default: false,
        },
        originalMessage: {
          id: String,
          text: String,
          file: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastMessage: {
      text: String,
      file: String,
      sender: {
        type: Schema.Types.ObjectId,
        ref: USER_SCHEMA,
      },
    },
  },
  { timestamps: true }
);

const Conversation =
  models?.Conversation || model(CONVERSATION_SCHEMA, conversationSchema);

export default Conversation;
