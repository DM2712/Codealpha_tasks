const { createClerkClient } = require('@clerk/backend');
const config = require('./env');

const clerkClient = createClerkClient({
  secretKey: config.clerk.secretKey,
  publishableKey: config.clerk.publishableKey,
});

module.exports = clerkClient;
