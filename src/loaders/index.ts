import expressLoader from "./express";
import { Application } from "express";

export default async (expressApp: Application) => {
  await expressLoader({ app: expressApp });
  console.log("Express initialized");
};
