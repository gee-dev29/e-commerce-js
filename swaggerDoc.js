import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Ecommerce API",
      description: "Documentation for the Ecommerce API",
      contact: {
        name: "Emmanuel",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "token",
          bearerFormat: "JWT",
          in: "header",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:8920",
        description: "Local development server",
      },
    ],
  },
  // Path to the API docs
  apis: ["./swaggerConfig/*.yml"], // Adjust the path as needed to your route files
};

const swaggeDocs = swaggerJSDoc(swaggerOptions);
const swaggerApi = (app) => {
  return app.use("/api-docs", SwaggerUi.serveWithOptions({}), SwaggerUi.serve, SwaggerUi.setup(swaggeDocs));
};

export {swaggerApi}