import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { resolvers } from './resolvers';
import express from 'express';
import databaseConfig from './helpers/db.config';

const main = async () => {
  const con = await createConnection(databaseConfig);
  if (con.isConnected === false) {
    throw new Error('failed to connect to the database');
  }

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
