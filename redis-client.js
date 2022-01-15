const redis = require('redis');

const redisPort = process.env.REDIS_PORT ? process.env.REDIS_PORT : 6379;
const redisHost = process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost';

const url = `redis://${redisHost}:${redisPort}`;

const client = redis.createClient({
    url
});

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
})();

module.exports = client;
