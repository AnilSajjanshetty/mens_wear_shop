const { createClient } = require("@redis/client");
const config = require("../Config/config");

/*
 Check IP address using the following command:
 docker inspect glams-redis | grep IPAddress
 Possible Redis URLs:
 - "redis://172.19.0.3:6379"
 - "redis://glams-redis:6379"
 - "redis://redis:6379"
 - "redis://your_ip:6379"
*/
const redisClient = createClient({
  url: config.redisUrl,
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error(`❌ Redis connection error: ${error.message}`);
  }
};

// Initialize Redis connection on app start
connectRedis();

/**
 * Store data in Redis cache
 * @param {string} key - The key to store data under
 * @param {any} value - The data to store (automatically stringified if not a string)
 * @param {number} [expiry=3600] - Expiry time in seconds (default: 1 hour)
 */
const setToCache = async (key, value, expiry = 300) => {
  try {
    const data = typeof value === "string" ? value : JSON.stringify(value);
    await redisClient.set(key, data, { EX: expiry });
    console.log(`✅ Redis - Data stored: ${key}`);
  } catch (error) {
    console.error(`❌ Redis - Error storing data: ${error.message}`);
  }
};

/**
 * Retrieve data from Redis cache
 * @param {string} key - The key to retrieve data from
 * @returns {Promise<any>} - The retrieved data (parsed if JSON)
 */
const getFromCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    if (data) {
      console.log(`✅ Redis - Data fetched: ${key}`);
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`❌ Redis - Error fetching data: ${error.message}`);
    return null;
  }
};

module.exports = { setToCache, getFromCache };
