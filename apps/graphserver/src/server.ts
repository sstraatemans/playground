import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { schema } from './schema';

const yoga = createYoga({
  schema,
  graphiql: true, // UI at http://localhost:4000
});

const server = createServer(yoga);

const port = process.env.PORT ?? 4001;
server.listen(port, () => {
  console.log(`GraphQL server ready at http://localhost:${port}/graphql`);
});
