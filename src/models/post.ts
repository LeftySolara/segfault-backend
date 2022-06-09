import { Schema, Types, model } from "mongoose";

interface Author {
  authorId: Types.ObjectId;
  username: string;
  email: string;
}

interface Thread {
  threadId: Types.ObjectId;
  topic: string;
}

interface IPost {
  author: Author;
  thread: Thread;
  dateCreated: Date;
  content: string;
}

const postSchema: Schema = new Schema<IPost>({
  author: {
    authorId: { type: Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
  },
  thread: {
    threadId: { type: Schema.Types.ObjectId, required: true },
    topic: { type: String, required: true },
  },
  dateCreated: { type: Date, required: true, immutable: true },
  content: { type: String, required: true },
});

export default model<IPost>("Post", postSchema);
