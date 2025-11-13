import type { FC } from "react";
import { CardFooter } from "../Card/CardFooter";
import { Card } from "../Card/Card";
import Stack from "../layout/Stack";
import { CardContent } from "../Card/CardContent";
import { UILink } from "../UILink/UILink";

export const DocsLinks: FC = () => (
  <Stack direction={{ default: "col", md: "row" }} className="gap-2">
    <Card title="GraphQL" className="basis-1/3">
      <CardContent>
        A GraphQL API to access the data. Flexible queries to get exactly what
      </CardContent>
      <CardFooter>
        <UILink
          label="Changelogs"
          variant="secondary"
          href="/docs/graphql/changelogs"
        />
        <UILink
          variant="transparent"
          external
          href="https://graphql.suskeenwiske.dev/v1"
          label="Playground"
        />
      </CardFooter>
    </Card>

    <Card title="Rest" className="basis-1/3">
      <CardContent>
        A RESTful API (HATEOAS) to access the data. Simple endpoints returning
        JSON.
      </CardContent>
      <CardFooter>
        <UILink
          label="Changelogs"
          variant="secondary"
          href="/docs/rest/changelogs"
        />
        <UILink label="Docs" href="/docs/rest" />
      </CardFooter>
    </Card>

    <Card title="tRPC" className="basis-1/3">
      <CardContent>
        tRPC endpoints to access the data. Type-safe and efficient.
      </CardContent>
      <CardFooter>
        <UILink
          label="Changelogs"
          variant="secondary"
          href="/docs/trpc/changelogs"
        />
        <UILink label="Docs" href="/docs/trpc" />
      </CardFooter>
    </Card>
  </Stack>
);
