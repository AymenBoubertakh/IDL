import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { resolvers } from './resolvers/index.js';
import { CONFIG } from './config/constants.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read GraphQL schema
const typeDefs = readFileSync(
  join(__dirname, 'schema', 'schema.graphql'),
  'utf-8'
);

// Create Express app
const app = express();
const httpServer = http.createServer(app);

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
    };
  },
});

// Start Apollo Server
await server.start();

// NO CORS middleware here! The API Gateway handles CORS.
// GraphQL service should not add any CORS headers to avoid duplication.
app.use(
  '/graphql',
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      // You can add authentication context here if needed
      return {};
    },
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'GraphQL' });
});

// Start server
await new Promise((resolve) => httpServer.listen({ port: CONFIG.PORT }, resolve));

console.log('\n' + '='.repeat(70));
console.log('🚀 GRAPHQL SERVICE STARTED SUCCESSFULLY!');
console.log('='.repeat(70));
console.log(`📍 GraphQL Server:    http://localhost:${CONFIG.PORT}/graphql`);
console.log(`📍 Health Check:      http://localhost:${CONFIG.PORT}/health`);
console.log(`🌐 Environment:       ${CONFIG.NODE_ENV}`);
console.log(`🔒 CORS:              Disabled (handled by API Gateway)`);
console.log('='.repeat(70));
console.log('\n📋 CONNECTED MICROSERVICES:');
console.log(`   🎓 Student Service:  ${CONFIG.STUDENT_SERVICE_URL}`);
console.log(`   📚 Course Service:   ${CONFIG.COURSE_SERVICE_URL}`);
console.log(`   🤖 Chatbot Service:  ${CONFIG.CHATBOT_SERVICE_URL}`);
console.log('='.repeat(70));
console.log('\n💡 GraphQL receives requests through API Gateway (port 9090)');
console.log('='.repeat(70) + '\n');