import mongoose from "mongoose";
import { Schema } from "mongoose";

const PostSchema = new Schema({
  body: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  likedIds: [{ type: Schema.Types.ObjectId, ref: "users" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "posts" }],
  replies: [{ type: Schema.Types.ObjectId, ref: "posts" }],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
  type:{type:String, enum:['post','comment','reply'], default:'post'},
});

const posts = mongoose.models?.posts || mongoose.model("posts", PostSchema);
export default posts;
