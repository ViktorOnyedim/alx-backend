const redis = require('redis');

// Create a Redis client
const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error.message}`);
});

// Subscribe to the channel 'ALXchannel'
client.subscribe('ALXchannel');

client.on('message', (channel, message) => {
  console.log(`${message}`);
  if (message === 'KILL_SERVER') {
    client.unsubscribe();
    client.quit();
  }
});
