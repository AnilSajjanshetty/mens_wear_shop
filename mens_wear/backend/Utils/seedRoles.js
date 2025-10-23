const roles = require("../Modal/Roles-Modal");

const seedRoles = async () => {
  try {
    const existingRoles = await roles.find();
    if (existingRoles.length === 0) {
      await roles.insertMany([
        { RoleId: 1, RoleName: "Admin" },
        { RoleId: 2, RoleName: "Vendor" },
        { RoleId: 3, RoleName: "User" },
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
