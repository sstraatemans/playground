import Stack from "@/components/layout/Stack";
import { Heading } from "@/components/Typography/Heading";
import { Typography } from "@/components/Typography/Typography";
import { Swagger } from "./Swagger";

const Page = () => {
  const swaggerUrl = process.env.NEXT_PUBLIC_REST_SWAGGER;

  if (!swaggerUrl) {
    return (
      <Stack direction="col">
        <Heading>REST API</Heading>
        <Typography>
          Swagger URL not configured. Please set NEXT_PUBLIC_REST_SWAGGER
          environment variable.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack direction="col">
      <Heading>REST API</Heading>

      <Typography>This is the rest api</Typography>
      <Swagger url={swaggerUrl} />
    </Stack>
  );
};

export default Page;
