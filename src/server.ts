// src/server.ts

import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { getUserFromToken, User } from './auth';

interface Context {
  user: User;
}

const server = new ApolloServer(
  // cast to any so TS won’t reject the `subscriptions` property
  {
    typeDefs,
    resolvers,

    // both HTTP requests and WS connections get a `user` in context
    context: ({ req, connection }: { req?: any; connection?: any }): Context => {
      if (req) {
        return { user: getUserFromToken(req.headers.authorization) };
      }
      return { user: getUserFromToken(connection.context.authorization) };
    },

    // this block still runs at runtime for subscriptions
    subscriptions: {
      onConnect: (connectionParams: any) => {
        return { user: getUserFromToken(connectionParams.authorization) };
      },
    },
  } as any
);

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:4000/graphql`);
});
