import mongoose from "mongoose";

const boardCategorySchema: mongoose.Schema = new mongoose.Schema({
  topic: { type: String, required: true },
  boards: [{ type: mongoose.Types.ObjectId, required: true, ref: "Board" }],
  sortOrder: { type: Number, required: true, min: 0 },
});

export default mongoose.model("BoardCategory", boardCategorySchema);
