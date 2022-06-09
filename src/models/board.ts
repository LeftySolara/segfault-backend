import { Schema, Types, model, Model } from "mongoose";

interface Category {
  _id: Types.ObjectId;
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
  category: new Schema<Category>({ topic: String }),
  threads: [{ type: Schema.Types.ObjectId, required: true, ref: "Thread" }],
});

const BoardModel = model<Board, BoardModelType>("Board", boardSchema);

export default BoardModel;
