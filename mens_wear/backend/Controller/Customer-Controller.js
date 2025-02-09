require("../DataBase/DbConnection");
const users = require("../Modal/User-Modal");
const userRole = require("../Modal/Users-Role-Modal");
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
    const Customer = await users.findOne({ CustomerId: customerId });

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
  try {
    const updateCustomer = {
      UserName: req.body.UserName,
      Email: req.body.Email,
      Password: req.body.Password,
      MobileNo: req.body.MobileNo,
      Address: req.body.Address,
    };
    const updateCustomers = await users.updateOne(
      { CustomerId: req.params.customerId },
      { $set: updateCustomer }
    );

    res.send(updateCustomer);
  } catch (error) {
    console.log("Update failed", error);
    res.send(error);
  }
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
