import { Schema, Types, model } from "mongoose";

interface IBoardCategory {
  topic: string;
  boards: Types.ObjectId[];
  sortOrder: number;
}

const boardCategorySchema: Schema = new Schema<IBoardCategory>({
  topic: { type: String, required: true },
  boards: [{ type: Schema.Types.ObjectId, required: true, ref: "Board" }],
  sortOrder: { type: Number, required: true, min: 0 },
});

export default model<IBoardCategory>("BoardCategory", boardCategorySchema);
