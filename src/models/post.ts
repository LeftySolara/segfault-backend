import { Schema, Types, model, Model } from "mongoose";

interface Author {
  authorId: Types.ObjectId;
  username: string;
  email: string;
}

interface Thread {
  threadId: Types.ObjectId;
  topic: string;
}

interface Post {
  author: Author;
  thread: Thread;
  dateCreated: Date;
  content: string;
}

type PostDocumentOverrides = {
  author: Types.Subdocument<Types.ObjectId> & Author;
  thread: Types.Subdocument<Types.ObjectId> & Thread;
};

type PostModelType = Model<Post, {}, PostDocumentOverrides>;

const postSchema = new Schema<Post, PostModelType>({
  author: new Schema<Author>(
    {
      authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      username: { type: String, required: true },
      email: { type: String, required: true },
    },
    { _id: false },
  ),
  thread: new Schema<Thread>(
    {
      threadId: { type: Schema.Types.ObjectId, required: true, ref: "Thread" },
      topic: { type: String, required: true },
    },
    { _id: false },
  ),
  dateCreated: { type: Date, required: true, immutable: true },
  content: { type: String, required: true },
});

const PostModel = model<Post, PostModelType>("Post", postSchema);

export default PostModel;
