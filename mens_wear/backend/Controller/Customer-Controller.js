require("../DataBase/DbConnection");
const users = require("../Modal/User-Modal");
const userRole = require("../Modal/Users-Role-Modal");
const { uploadSingle } = require("../Config/MulterConfig");
const multer = require("multer");

//--------------------------------------------------------------------------------------------
//------   Home , get request ,  /
//--------------------------------------------------------------------------------------------
const home = async (req, res) => {
  try {
    res.status(200).send("Hello  From I shop");
  } catch (error) {
    console.log("customer error", error);
  }
};

//--------------------------------------------------------------------------------------------
//------   Register Customer , post request ,  /register-customer
//--------------------------------------------------------------------------------------------
const registerCustomer = async (req, res) => {
  try {
    const register = new users(req.body);
    const createcust = await register.save();
    // Step 2: Create a role for the registered user
    const userRoles = new userRole({
      UserId: createcust.UserId, // Assuming the user model uses MongoDB's ObjectId
      RoleId: 3, // Default role as "User"
    });
    const createRole = await userRoles.save();
    if (!createcust) {
      res.status(400).send({
        message: "Registration failed",
      });
    } else if (!createRole) {
      res.status(400).send({
        message: "role creation  failed",
      });
    }

    res.status(201).send({
      user: createcust,
      role: createRole,
    });
  } catch (error) {
    console.error("Registration failed", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};
//--------------------------------------------------------------------------------------------
//------  get All Customer , get request ,  /get-customer
//--------------------------------------------------------------------------------------------
const getAllCustomer = async (req, res) => {
  try {
    const allCustomers = await users.find({});

    res.send(allCustomers);
  } catch (error) {
    console.log("Login failed", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------  get single Customer , get request ,  /get-customer/:customerId
//--------------------------------------------------------------------------------------------
const getSingleCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const Customer = await users.findOne({ UserId: customerId });

    if (Customer) {
      res.send(Customer);
    } else {
      res.status(404).send("Customer not found");
    }
  } catch (error) {
    console.log("failed to get Customer", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------   Edit Customer , put request ,  /Edit-customer
//--------------------------------------------------------------------------------------------
const editCustomer = async (req, res) => {
  uploadSingle(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Multer Error: " + err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      const customerId = req.params.customerId;
      const user = await users.findOne({ UserId: customerId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user fields
      user.userName = req.body.userName || user.userName;
      user.Email = req.body.Email || user.Email;
      user.MobileNo = req.body.MobileNo || user.MobileNo;
      user.Address = req.body.Address || user.Address;

      // Update profile picture if provided
      // Update profile picture if provided
      console.log("Uploaded file:", req.file);
      if (req.file) {
        user.Image = `UploadedFiles/${req.file.filename}`;
      } else {
        console.log("No image file received!");
      }

      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
};

//------------------------------------------------------------------------------------
//-----------   Delete customer by roduct id ,delete request   /delete-customer/:customerId
//---------------------------------------------------------------------------------------
const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const deletedCustomer = await users.findOneAndDelete({
      CustomerId: customerId,
    });

    if (deletedCustomer) {
      res.send("Vendor deleted successfully");
    } else {
      res.status(404).send("customer not found");
    }
  } catch (error) {
    console.error("Failed to delete customer:", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  home,
  registerCustomer,
  getAllCustomer,
  editCustomer,
  deleteCustomer,
  getSingleCustomer,
};
