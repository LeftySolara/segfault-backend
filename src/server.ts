import app from "./app";
import config from "./config";
import initLoaders from "./loaders";
import loggerService from "./services/logger";

(async () => {
  await initLoaders(app);
})();

app.listen(config.port, () => {
  loggerService.info(`Listening on port ${config.port}...`);
});
