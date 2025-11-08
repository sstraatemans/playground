import { createSwaggerSpec } from "next-swagger-doc";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const spec = createSwaggerSpec({
  apiFolder: "src/app/api/v1", // Scans your API routes folder
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js API", // Default title
      version: "1.0.0", // Default version
      description: "API documentation for Next.js project", // Default description
    },
  },
});

const Page = () => {
  return (
    <div>
      <h2>Rest Api Swagger</h2>
      <SwaggerUI spec={spec} />
    </div>
  );
};

export default Page;
