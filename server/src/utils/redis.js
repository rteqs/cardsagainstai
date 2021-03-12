const redis = require('redis');
const { v4: uuidv4 } = require('uuid');

const client = redis.createClient();

client.on('connect', () => {
  console.log('connected to redis');
});

client.on('error', (error) => {
  console.error(error);
});

// module.exports =
