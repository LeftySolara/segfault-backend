import mongoose from "mongoose";

const boardSchema: mongoose.Schema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    categoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "BoardCategory",
    },
    topic: { type: String, required: true },
  },
  threads: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Thread",
    },
  ],
});

export default mongoose.model("Board", boardSchema);
