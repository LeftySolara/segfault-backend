import { Schema, Types, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from "bcrypt";
import loggerService from "../services/logger";

interface IUser {
  username: string;
  email: string;
  password: string;
  joinDate: Date;
  posts: Types.ObjectId[];
  threads: Types.ObjectId[];
}

const userSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  password: { type: String, required: true, minlength: 8 },
  joinDate: { type: Date, required: true, immutable: true },
  posts: [{ type: Schema.Types.ObjectId, required: true, ref: "Post" }],
  threads: [{ type: Schema.Types.ObjectId, required: true, ref: "Thread" }],
});

// Hash the user's password before saving to the database
userSchema.pre("save", async function (next) {
  const user = this;

  try {
    if (!user.isModified("password")) {
      next();
    }
    const hash: string = await bcrypt.hash(user.password, 13);
    user.password = hash;
    next();
  } catch (err: any) {
    loggerService.error(err);
    next(err);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (err: any) {
    return false;
  }
};

userSchema.plugin(uniqueValidator);

export default model<IUser>("User", userSchema);
