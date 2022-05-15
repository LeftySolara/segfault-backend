import dotenv from "dotenv";
import swaggerSpecs from "./swagger";

interface config {
  port: string | undefined;
  db: {
    connection_string: string | undefined;
  };
  jwt: {
    secret: string | undefined;
    key: string | undefined;
  };
  swagger: object;
}

/* Load environment variables. If we're not in a production environment, then
   get the variables from a file. Otherwise use the deployed environment. */
if (process.env.NODE_ENV !== "production") {
  const configOutput = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  if (configOutput.error) {
    throw configOutput.error;
  }
}

const config: config = {
  port: process.env.PORT,
  db: {
    connection_string: process.env.MONGO_CONNECTION_STRING,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    key: process.env.JWT_KEY,
  },
  swagger: swaggerSpecs,
};

export default config;
