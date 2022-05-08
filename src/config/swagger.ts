import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Segfault Internal API",
      version: "1.0.0",
      description: "A programming forum API",
      contact: {
        name: "Julianne Adams",
        email: "julianne@julianneadams.info",
        url: "https://julianneadams.info",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
  },
  apis: ["**/*.routes.ts"],
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;
