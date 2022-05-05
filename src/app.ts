import config from "./config";
import initLoaders from "./loaders";
import express from "express";

const PORT = config.port || 8000;

const startServer = async () => {
  const app = express();

  await initLoaders(app);

  app.listen(PORT, () => {
    console.log(`Server is running here: http://localhost:${PORT}`);
  });
};

startServer();
