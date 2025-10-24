// const mongoose = require("mongoose");
// const seedRoles = require("../Utils/seedRoles");
// const intialDbConnection = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/Shraddha-Jeans");
//     seedRoles(); // Seed roles when the app starts
//     console.log("db connected");
//   } catch (error) {
//     console.error("database connetion error", error);
//   }
// };

// intialDbConnection().then(() => console.log("connected"));

// require("dotenv").config();
// const mongoose = require("mongoose");
// const seedRoles = require("../Utils/seedRoles");

// const intialDbConnection = async () => {
//   try {
//     // Connect to MongoDB Atlas
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 20000, // optional, avoids timeout
//     });

//     console.log("✅ MongoDB Atlas connected successfully");

//     // ✅ Seed roles immediately after successful connection
//     await seedRoles();
//     console.log("✅ Roles seeded successfully");
//   } catch (error) {
//     console.error("❌ Database connection or seeding error:", error);
//   }
// };

// intialDbConnection();

require("dotenv").config();
const mongoose = require("mongoose");
const seedRoles = require("../Utils/seedRoles");

// Cache the connection globally (important for serverless like Vercel)
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

const intialDbConnection = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // bufferCommands: false, // prevents Mongoose buffering before connection
      })
      .then(async (mongoose) => {
        console.log("✅ MongoDB connected");

        // Seed roles if not already seeded
        await seedRoles();
        console.log("✅ Roles seeded");

        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = intialDbConnection;
