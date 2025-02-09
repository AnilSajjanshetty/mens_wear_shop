require("../DataBase/DbConnection");
const vendors = require("../Modal/Vendor-Modal");

//--------------------------------------------------------------------------------------------
//------   Add  vendor , post request ,  /add-vendor
//--------------------------------------------------------------------------------------------
const addVendor = async (req, res) => {
  try {
    const newVendor = new vendors(req.body);
    const createVendor = await newVendor.save();

    res.send(createVendor);
  } catch (error) {
    console.log(" failed to add new Vendor", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------  get all vendor , get request ,  /get-vendor
//--------------------------------------------------------------------------------------------
const getVendor = async (req, res) => {
  try {
    const allVendor = await vendors.find({});

    res.send(allVendor);
  } catch (error) {
    console.log("failed to get Vendor", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------  get single vendor , get request ,  /get-vendor/:vendorId
//--------------------------------------------------------------------------------------------
const getSingleVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const vendor = await vendors.findOne({ VendorId: vendorId });

    if (vendor) {
      res.send(vendor);
    } else {
      res.status(404).send("Vendor not found");
    }
  } catch (error) {
    console.log("failed to get Vendor", error);
    res.send(error);
  }
};

//--------------------------------------------------------------------------------------------
//------  get single vendor by category id, get request ,  /get-vendor/:categoryId
//--------------------------------------------------------------------------------------------
const getSingleVendorByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const vendorByCategoryId = await vendors.find({ CategoryId: categoryId });

    if (vendorByCategoryId) {
      res.send(vendorByCategoryId);
    } else {
      res.status(404).send("category type Vendor not found");
    }
  } catch (error) {
    console.log("failed to get Vendor by category type", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------   Edit Product , put request ,  /Edit-product
//--------------------------------------------------------------------------------------------
const editVendor = async (req, res) => {
  try {
    const updateVendor = {
      VendorName: req.body.VendorName,
      CategoryId: req.body.CategoryId,
      City: req.body.City,
    };
    const updateSingleVendor = await vendors.updateOne(
      { VendorId: req.params.vendorId },
      { $set: updateVendor }
    );

    res.send(updateSingleVendor);
  } catch (error) {
    console.log("failed to updated Vendor", error);
    res.send(error);
  }
};
//------------------------------------------------------------------------------------
//-----------   Delete product by roduct id ,delete request   /delete-product/:productId
//---------------------------------------------------------------------------------------
const deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const deletedVendor = await vendors.findOneAndDelete({
      VendorId: vendorId,
    });

    if (deletedVendor) {
      res.send("Vendor deleted successfully");
    } else {
      res.status(404).send("Vendor not found");
    }
  } catch (error) {
    console.error("Failed to delete Vendor:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addVendor,
  getVendor,
  editVendor,
  getSingleVendor,
  deleteVendor,
  getSingleVendorByCategoryId,
};
