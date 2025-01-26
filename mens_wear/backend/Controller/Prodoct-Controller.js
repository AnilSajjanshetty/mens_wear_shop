const multer = require("multer");
require("../DataBase/DbConnection");
const products = require("../Modal/Products-Modal");
const upload = require("../Config/MulterConfig");

//--------------------------------------------------------------------------------------------
//------   Add  productt , post request ,  /add-product
//--------------------------------------------------------------------------------------------
// const addProduct = async (req,res) =>{
//     try {
//         const newProduct = new products(req.body);
//         const createproduct = await newProduct.save();

//         res.send(createproduct);
//         console.log(createproduct);
//       } catch (error) {
//         console.log(" failed to add new product",error)
//         res.send(error);
//       }
// }
const addProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Multer error: " + err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      // If file upload is successful
      console.log("========================================================");
      console.log("file name=", req.file);
      const newProductData = {
        ...req.body,
        Image: "UploadedFiles/" + req.file.filename,
      };
      const newProduct = new products(newProductData);
      const createdProduct = await newProduct.save();

      res.send(createdProduct);
      console.log(createdProduct);
    });
  } catch (error) {
    console.log("Failed to add new product", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//--------------------------------------------------------------------------------------------
//------  get all products , get request ,  /get-product
//--------------------------------------------------------------------------------------------
const getProduct = async (req, res) => {
  try {
    const allProducts = await products.find({});

    res.send(allProducts);
    console.log(allProducts);
  } catch (error) {
    console.log("failed to get products", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------  get single products , get request ,  /get-product/:poductId
//--------------------------------------------------------------------------------------------
const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await products.findOne({ ProductId: productId });

    if (product) {
      res.send(product);
      console.log(product);
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
// const editproduct = async (req,res) =>{
//     try {

//     const updateProduct=
//         {
//             ProductId:req.body.ProductId,
//             ProductName: req.body.ProductName,
//             Description: req.body.Description,
//             Price: req.body.Price,
//             Rating: req.body.Rating,
//             Stock: req.body.Stock,
//             CategoryId: req.body.CategoryId,
//             VendorId: req.body.VendorId,
//             Image: req.body.Image,
//           }
//         const updateSingleProduct = await products.updateOne({ ProductId: req.params.productId },{$set:updateProduct})

//         res.send(updateSingleProduct);
//         console.log(updateSingleProduct);
//       } catch (error) {
//         console.log("failed to updated product",error)
//         res.send(error);
//       }
// }
const editproduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Multer error: " + err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      // If file upload is successful
      const updateProduct = {
        ProductName: req.body.ProductName,
        Description: req.body.Description,
        Price: req.body.Price,
        Rating: req.body.Rating,
        Stock: req.body.Stock,
        CategoryId: req.body.CategoryId,
        // VendorId: req.body.VendorId,
      };

      // Check if a new file is uploaded
      if (req.file) {
        updateProduct.Image = "UploadedFiles/" + req.file.filename;
      }

      const updateSingleProduct = await products.updateOne(
        { ProductId: req.params.productId },
        { $set: updateProduct }
      );

      res.send(updateProduct);
    });
  } catch (error) {
    console.log("Failed to update product", error);
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
      console.log("Deleted product:", deletedProduct);
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
