import app from "./app";
import config from "./config";
import initLoaders from "./loaders";
import loggerService from "./services/logger";

(async () => {
  await initLoaders(app);
})();

const server = app.listen(config.port, () => {
  loggerService.info(`Listening on port ${config.port}...`);
});

const gracefulShutdown = (msg: String) => {
  loggerService.info("Closing HTTP server due to " + msg);
  server.close(() => {
    loggerService.info("HTTP server closed");
  });
};

process.on("SIGTERM", () => gracefulShutdown("app termination"));
process.on("SIGUSR2", () => gracefulShutdown("nodemon restart"));
process.on("SIGINT", () => gracefulShutdown("app termination"));
