import mongoose from "mongoose";

const postSchema: mongoose.Schema = new mongoose.Schema({
  author: {
    authorId: { type: mongoose.Types.ObjectId, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
  },
  thread: {
    threadId: { type: mongoose.Types.ObjectId, required: true },
    topic: { type: String, required: true },
  },
  dateCreated: { type: Date, required: true, immutable: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model("Post", postSchema);
