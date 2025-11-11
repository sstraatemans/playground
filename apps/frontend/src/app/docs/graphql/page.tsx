import Stack from "@/components/layout/Stack";
import { Heading } from "@/components/Typography/Heading";
import { Typography } from "@/components/Typography/Typography";

const Page = () => {
  return (
    <Stack direction="col">
      <Heading>GraphQL</Heading>

      <Typography>GraphQL documentation will be here soon.</Typography>
      <a href="/graphql.suskeenwiske.dev/v1">Go to the graph docs</a>
    </Stack>
  );
};

export default Page;
