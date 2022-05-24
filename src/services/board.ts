import BoardModel from "../models/board";
import HttpError from "../utils/httpError";

/**
 * Get all boards from the database
 *
 * @returns An array of board objects
 */
const getAll = async () => {
  let boards;

  try {
    boards = await BoardModel.find({});
  } catch (err) {
    throw new HttpError("Failed to fetch boards", 500);
  }

  return boards.map((board) => board.toObject({ getters: true }));
};

export default {
  getAll,
};
