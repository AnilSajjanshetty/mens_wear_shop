const multer = require("multer");
require("../DataBase/DbConnection");
const products = require("../Modal/Products-Modal");
const { upload } = require("../Config/MulterConfig");

//--------------------------------------------------------------------------------------------
//------   Add  productt , post request ,  /add-product
//--------------------------------------------------------------------------------------------
const addProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Multer error: " + err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Ensure files are uploaded
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one image is required!" });
      }

      // Explicitly add image paths to req.body
      req.body.Image = req.files.map(
        (file) => "UploadedFiles/" + file.filename
      );
      // Create product data with image paths
      const newProductData = {
        ...req.body,
      };

      // Save the product to the database
      const newProduct = new products(newProductData);
      const createdProduct = await newProduct.save();

      res.status(201).json(createdProduct);
    });
  } catch (error) {
    console.error("Failed to add new product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//--------------------------------------------------------------------------------------------
//------  get all products , get request ,  /get-product
//--------------------------------------------------------------------------------------------
const getProduct = async (req, res) => {
  try {
    // Fetch all products and populate CategoryId with only the categoryName field
    const allProducts = await products
      .find({})
      .populate("CategoryId", "categoryName") // Populate only categoryName from Category model
      .exec();

    if (!allProducts || allProducts.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Map over allProducts to include categoryName directly in the product object
    const productsWithCategoryName = allProducts.map((product) => ({
      ...product.toObject(),
      categoryName: product.CategoryId.categoryName, // Extract categoryName and add it directly
      CategoryId: product.CategoryId._id, // Remove the CategoryId object
    }));

    res.status(200).json(productsWithCategoryName);
  } catch (error) {
    console.error("Failed to get products", error);

    // Send a response with a generic error message and status code
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "An unexpected error occurred",
    });
  }
};

//--------------------------------------------------------------------------------------------
//------  get single products , get request ,  /get-product/:poductId
//--------------------------------------------------------------------------------------------
const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await products.findOne({ _id: productId });

    if (product) {
      res.send(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.log("failed to get products", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------   Edit Product , put request ,  /Edit-product
//--------------------------------------------------------------------------------------------
const editproduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Multer error: " + err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Prepare updated product fields
      const updateProduct = {
        ProductName: req.body.ProductName,
        Description: req.body.Description,
        Price: req.body.Price,
        Rating: req.body.Rating,
        Stock: req.body.Stock,
        CategoryId: req.body.CategoryId,
      };

      // If new files are uploaded, update images
      if (req.files && req.files.length > 0) {
        updateProduct.Image = req.files.map(
          (file) => "UploadedFiles/" + file.filename
        );
      }

      const updateSingleProduct = await products.updateOne(
        { ProductId: req.params.productId },
        { $set: updateProduct }
      );

      if (updateSingleProduct.modifiedCount === 0) {
        return res
          .status(404)
          .json({ error: "Product not found or no changes applied" });
      }

      res
        .status(200)
        .json({ message: "Product updated successfully", updateProduct });
    });
  } catch (error) {
    console.error("Failed to update product", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//------------------------------------------------------------------------------------
//-----------   Delete product by roduct id ,delete request   /delete-product/:productId
//---------------------------------------------------------------------------------------
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await products.findOneAndDelete({
      ProductId: productId,
    });

    if (deletedProduct) {
      res.send("Product deleted successfully");
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addProduct,
  getProduct,
  editproduct,
  getSingleProduct,
  deleteProduct,
};
