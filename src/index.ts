import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { resolvers } from './resolvers';
import express from 'express';

const main = async () => {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
    }),
  });

  apolloServer.applyMiddleware({ app });
  app.use('/assets', express.static('assets'));

  app.listen(3000, () => {
    console.log('server started on localhost:3000');
  });
};
main();
