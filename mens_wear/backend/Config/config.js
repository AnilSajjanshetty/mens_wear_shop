require("dotenv").config();
const os = require("os");

function getLocalIp() {
  const networkInterfaces = os.networkInterfaces();
  for (const iface in networkInterfaces) {
    for (const net of networkInterfaces[iface]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1"; // Fallback to localhost
}

const config = {
  HOST: process.env.HOST || getLocalIp(),
  PORT: process.env.PORT || 3000,
  HYDRA_URL: process.env.HYDRA_ADMIN_URL,
};

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
