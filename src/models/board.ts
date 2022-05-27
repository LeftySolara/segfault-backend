import { Schema, Types, model } from "mongoose";

interface Category {
  id: Types.ObjectId;
  topic: string;
}

interface IBoard {
  topic: string;
  description: string;
  category: Category;
  threads: Types.ObjectId[];
}

const boardSchema: Schema = new Schema<IBoard>({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "BoardCategory",
    },
    topic: { type: String, required: true },
  },
  threads: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Thread",
    },
  ],
});

export default model<IBoard>("Board", boardSchema);
