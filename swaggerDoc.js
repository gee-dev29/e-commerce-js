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
          name: "Authorization",
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
  apis: ["./swaggerConfig/*.yml"], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

const swaggerApi = (app) => {
  app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocs));
};

export {swaggerApi};
