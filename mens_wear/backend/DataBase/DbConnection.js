// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/I-Shop',{
//     useCreateIndex:true,
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// }).then(()=>{console.log("connection done");
// }).catch(((e)=>{console.log("no connection ");
// }))

const mongoose = require("mongoose");
const seedRoles = require("../Utils/seedRoles");
const intialDbConnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Shraddha-Jeans");
    seedRoles(); // Seed roles when the app starts
    console.log("db connected");
  } catch (error) {
    console.error("database connetion error", error);
  }
};

intialDbConnection().then(() => console.log("connected"));

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
