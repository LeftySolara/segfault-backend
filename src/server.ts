import app from "./app";
import config from "./config";
import loggerService from "./services/logger";

app.listen(config.port, () => {
  loggerService.info(`Listening on port ${config.port}...`);
});
