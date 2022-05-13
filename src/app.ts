import express from "express";
import initLoaders from "./loaders";

const app = express();

(async () => {
  await initLoaders(app);
})();

export default app;
