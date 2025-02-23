require("dotenv").config();
const redis = require("redis");

const config = {
  HOST: process.env.HOST_IP,
  PORT: process.env.PORT || 8000,
  HYDRA_URL: process.env.HYDRA_ADMIN_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  redisUrl: process.env.REDIS_ENDPOINT || "redis://localhost:6379",
};

// const redisClient = redis.createClient({
//   host: config.REDIS_HOST,
//   port: config.REDIS_PORT,
// });

// redisClient
//   .connect()
//   .catch((err) => console.error("Redis connection error:", err));

// module.exports = { config, redisClient };
module.exports = config;

// require('dotenv').config();

// const environments = {
//   development: {
//     HOST: process.env.HOST || '127.0.0.1',
//     PORT: process.env.PORT || 3000,
//   },
//   production: {
//     HOST: process.env.HOST || '0.0.0.0',
//     PORT: process.env.PORT || 8000,
//   },
// };

// // Select configuration based on NODE_ENV
// const NODE_ENV = process.env.NODE_ENV || 'development';
// module.exports = environments[NODE_ENV];
