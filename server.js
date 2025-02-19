const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolver');

const pubsub = new PubSub();
const schema = makeExecutableSchema({ typeDefs, resolvers });

mongoose
  .connect('mongodb+srv://himanshusinghcoder:9d7ipK22cWkS3Vyp@aelive.4caxr.mongodb.net/captions?retryWrites=true&w=majority&appName=aelive', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

const app = express();
app.use(cors());
app.use(express.static('public'));

const httpServer = createServer(app);

async function startServer() {
  const server = new ApolloServer({
    schema,
    context: ({ req, connection }) => {
      if (connection) {
        return connection.context;
      }
      return { pubsub };
    },
  });
  
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: () => {
        console.log('Client connected for subscriptions');
        return { pubsub };
      },
      onDisconnect: () => console.log('Client disconnected from subscriptions'),
    },
    {
      server: httpServer,
      path: '/graphql',
    }
  );

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`)
  );
}

startServer();
