import { Schema, Types, model, Model } from "mongoose";

interface BoardCategory {
  id: string;
  _id: Types.ObjectId;
  __v: number;
  topic: string;
  boards: Types.Array<Types.ObjectId>;
  sortOrder: number;
}

type BoardCategoryModelType = Model<BoardCategory, {}, {}>;

const boardCategorySchema = new Schema<BoardCategory, BoardCategoryModelType>({
  topic: { type: String, required: true, minlength: 1 },
  boards: [{ type: Schema.Types.ObjectId, required: true, ref: "Board" }],
  sortOrder: { type: Number, required: true, min: 0 },
});

const BoardCategoryModel = model<BoardCategory, BoardCategoryModelType>(
  "BoardCategory",
  boardCategorySchema,
);

export default BoardCategoryModel;
