import Stack from "@/components/layout/Stack";
import { Heading } from "@/components/Typography/Heading";
import { Typography } from "@/components/Typography/Typography";
import { createSwaggerSpec } from "next-swagger-doc";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const spec = createSwaggerSpec({
  apiFolder: "src/app/api/v1",
  definition: {
    openapi: "3.0.0",
    info: {
      title: "",
      version: "1.0.0",
    },
  },
});

const Page = () => {
  return (
    <Stack direction="col">
      <Heading>REST API</Heading>

      <Typography>This is the rest api</Typography>
      <SwaggerUI spec={spec} />
    </Stack>
  );
};

export default Page;
