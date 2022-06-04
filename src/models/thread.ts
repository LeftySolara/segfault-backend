import { Schema, Types, model } from "mongoose";

interface Author {
  authorId: Types.ObjectId;
  username: string;
  email: string;
}

interface Board {
  boardId: Types.ObjectId;
  topic: string;
}

interface IThread {
  author: Author;
  board: Board;
  topic: string;
  dateCreated: Date;
  posts: Types.ObjectId[];
  lastPost: Types.ObjectId;
}

const threadSchema: Schema = new Schema<IThread>({
  author: {
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    username: { type: String, required: true },
    email: { type: String, required: true },
  },
  board: {
    boardId: { type: Schema.Types.ObjectId, required: true },
    topic: { type: String, required: true },
  },
  topic: { type: String, required: true },
  dateCreated: { type: Date, required: true, immutable: true },
  posts: [{ type: Schema.Types.ObjectId, required: true, ref: "Post" }],
  lastPost: { type: Schema.Types.ObjectId, required: false, ref: "Post" },
});

export default model<IThread>("Thread", threadSchema);
