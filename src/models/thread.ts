import { Schema, Types, model, Model } from "mongoose";

interface Author {
  authorId: Types.ObjectId;
  username: string;
  email: string;
}

interface Board {
  boardId: Types.ObjectId;
  topic: string;
}

interface Thread {
  author: Author;
  board: Board;
  topic: string;
  dateCreated: Date;
  posts: Types.Array<Types.ObjectId>;
  lastPost: Date;
}

type ThreadDocumentOverrides = {
  author: Types.Subdocument<Types.ObjectId> & Author;
  board: Types.Subdocument<Types.ObjectId> & Board;
};

type ThreadModelType = Model<Thread, {}, ThreadDocumentOverrides>;

const threadSchema = new Schema<Thread, ThreadModelType>({
  author: new Schema<Author>(
    {
      authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      username: { type: String, required: true },
      email: { type: String, required: true },
    },
    { _id: false },
  ),
  board: new Schema<Board>(
    {
      boardId: { type: Schema.Types.ObjectId, required: true, ref: "Board" },
      topic: { type: String, required: true },
    },
    { _id: false },
  ),
  topic: { type: String, required: true },
  dateCreated: { type: Date, required: true, immutable: true },
  posts: [{ type: Schema.Types.ObjectId, required: true, ref: "Post" }],
  lastPost: { type: Date, required: false, immutable: false },
});

const ThreadModel = model<Thread, ThreadModelType>("Thread", threadSchema);

export default ThreadModel;
