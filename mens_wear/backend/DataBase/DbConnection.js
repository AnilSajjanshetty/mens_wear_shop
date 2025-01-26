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
