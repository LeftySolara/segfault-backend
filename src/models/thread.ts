import mongoose from "mongoose";

const threadSchema: mongoose.Schema = new mongoose.Schema({
  author: {
    authorId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    username: { type: String, required: true },
    email: { type: String, required: true },
  },
  board: {
    boardId: { type: mongoose.Types.ObjectId, required: true },
    topic: { type: String, required: true },
  },
  topic: { type: String, required: true },
  dateCreated: { type: Date, required: true, immutable: true },
  posts: [{ type: mongoose.Types.ObjectId, required: true, ref: "Post" }],
  lastPost: { type: mongoose.Types.ObjectId, required: true, ref: "Post" },
});

export default mongoose.model("Thread", threadSchema);
