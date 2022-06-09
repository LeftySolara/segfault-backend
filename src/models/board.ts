import { Schema, Types, model, Model } from "mongoose";

interface Category {
  categoryId: Types.ObjectId;
  topic: string;
}

interface Board {
  topic: string;
  description: string;
  category: Category;
  threads: Types.Array<Types.ObjectId>;
}

type BoardDocumentOverrides = {
  category: Types.Subdocument<Types.ObjectId> & Category;
};

type BoardModelType = Model<Board, {}, BoardDocumentOverrides>;

const boardSchema = new Schema<Board, BoardModelType>({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  threads: [{ type: Schema.Types.ObjectId, required: true, ref: "Thread" }],
  category: new Schema<Category>(
    {
      topic: { type: String, required: true },
      categoryId: { type: Schema.Types.ObjectId, required: true },
    },
    { _id: false },
  ),
});

const BoardModel = model<Board, BoardModelType>("Board", boardSchema);

export { BoardModel as default, Category };
