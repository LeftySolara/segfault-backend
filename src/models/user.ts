import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from "bcrypt";

import loggerService from "../services/logger";

const userSchema: mongoose.Schema = new mongoose.Schema({
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
  posts: [{ type: mongoose.Types.ObjectId, required: true, ref: "Post" }],
  threads: [{ type: mongoose.Types.ObjectId, required: true, ref: "Thread" }],
});

// Hash the user's password before saving to the database
userSchema.pre("save", async function (next) {
  const user = this;

  try {
    if (!user.isModified("password")) {
      next();
    }
    const hash: String = await bcrypt.hash(user.password, 13);
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

export default mongoose.model("User", userSchema);
