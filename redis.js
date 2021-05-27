const redis = require("redis");
const util = require("util");
const redisURL = process.env.REDIS || "redis://127.0.0.1:6379";
const client = redis.createClient(redisURL);
client.get = util.promisify(client.get);
client.hmget = util.promisify(client.hmget);
client.hget = util.promisify(client.hget);
client.lrange = util.promisify(client.lrange);

module.exports = client;
