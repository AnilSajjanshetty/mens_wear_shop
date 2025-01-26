const roles = require("../Modal/Roles-Modal");

const seedRoles = async () => {
  try {
    const existingRoles = await roles.find();
    if (existingRoles.length === 0) {
      await roles.insertMany([
        { RoleId: 1, Role: "Admin" },
        { RoleId: 2, Role: "Vendor" },
        { RoleId: 3, Role: "User" },
      ]);
      console.log("Roles seeded successfully.");
    } else {
      console.log("Roles already exist. No need to seed.");
    }
  } catch (error) {
    console.error("Error seeding roles:", error);
  }
};

module.exports = seedRoles;
