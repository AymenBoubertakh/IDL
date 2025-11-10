import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
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

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
    };
  },
});

// Start server
const { url } = await startStandaloneServer(server, {
  listen: { port: CONFIG.PORT },
  context: async ({ req }) => {
    // You can add authentication context here if needed
    return {};
  },
});

console.log('\n' + '='.repeat(70));
console.log('🚀 GRAPHQL SERVICE STARTED SUCCESSFULLY!');
console.log('='.repeat(70));
console.log(`📍 GraphQL Server:    ${url}`);
console.log(`📍 GraphQL Playground: ${url}`);
console.log(`🌐 Environment:       ${CONFIG.NODE_ENV}`);
console.log('='.repeat(70));
console.log('\n📋 CONNECTED MICROSERVICES:');
console.log(`   🎓 Student Service:  ${CONFIG.STUDENT_SERVICE_URL}`);
console.log(`   📚 Course Service:   ${CONFIG.COURSE_SERVICE_URL}`);
console.log(`   🤖 Chatbot Service:  ${CONFIG.CHATBOT_SERVICE_URL}`);
console.log('='.repeat(70));
console.log('\n💡 TIP: Open the URL above in your browser to use Apollo Playground!');
console.log('='.repeat(70) + '\n');