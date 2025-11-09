import Stack from "@/components/layout/Stack";
import { Heading } from "@/components/Typography/Heading";
import { Typography } from "@/components/Typography/Typography";
import { createSwaggerSpec } from "next-swagger-doc";
import { Swagger } from "./Swagger";

const Page = () => {
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

  return (
    <Stack direction="col">
      <Heading>REST API</Heading>

      <Typography>This is the rest api</Typography>
      <Swagger spec={spec} />
    </Stack>
  );
};

export default Page;
