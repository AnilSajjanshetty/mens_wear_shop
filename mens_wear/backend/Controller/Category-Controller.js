require("../DataBase/DbConnection");
const category = require("../Modal/Categories-Modal");
const products = require("../Modal/Products-Modal");

//--------------------------------------------------------------------------------------------
//------   Add  category , post request ,  /add-category
//-------------------------------------------------------------------------------`-------------
const addCategory = async (req, res) => {
  try {
    // Check if category name is provided
    if (!req.body.categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Create new category
    const newCategory = new category(req.body);

    // Save the new category to the database
    const createCategory = await newCategory.save();

    // Send back the created category with a 201 (Created) status
    res.status(201).json({
      message: "Category created successfully",
      category: createCategory,
    });
  } catch (error) {
    // Handle different types of errors
    console.log("Failed to add new category", error);

    // Check if error is related to validation or database
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }

    // Generic error handler for unexpected issues
    res.status(500).json({
      message: "Failed to add category",
      error: error.message || "Unknown error",
    });
  }
};

//--------------------------------------------------------------------------------------------
//------  get all category , get request ,  /get-category
//--------------------------------------------------------------------------------------------
const getCategory = async (req, res) => {
  try {
    const allCategory = await category.find({});

    // Check if no categories are found
    if (allCategory.length === 0) {
      return res.status(404).json({ message: "No categories found." });
    }

    // Send the response with the categories
    res.status(200).json(allCategory);
  } catch (error) {
    console.log("Failed to get categories", error);

    // Send the error response with a status code and error message
    res.status(500).json({
      message: "Internal server error. Failed to retrieve categories.",
      error: error.message || error,
    });
  }
};

//--------------------------------------------------------------------------------------------
//------  get single category , get request ,  /get-category/:categoryId
//--------------------------------------------------------------------------------------------
const getSingleCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    const product = await products
      .find({ CategoryId: categoryId }) // Use find() since you want an array of products
      .populate("CategoryId", "categoryName") // Populate only categoryName from Category model
      .exec();

    if (product && product.length > 0) {
      // Map over the products to include categoryName directly in the product object
      const allproducts = product.map((prod) => ({
        ...prod.toObject(),
        categoryName: prod.CategoryId.categoryName, // Extract categoryName and add it directly
        CategoryId: prod.CategoryId._id, // Remove the CategoryId object
      }));
      res.status(200).json(allproducts);
    } else {
      res
        .status(404)
        .json({ error: "Category not found or no products in this category" });
    }
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//--------------------------------------------------------------------------------------------
//------   Edit category , put request ,  /edit-category/:categoryId
//--------------------------------------------------------------------------------------------
const editCategory = async (req, res) => {
  const CategoryId = req.params.categoryId;
  try {
    const { categoryName } = req.body;
    // Validate if required fields are present
    if (!categoryName || !CategoryId) {
      return res
        .status(400)
        .json({ message: "Category Name and CategoryId are required." });
    }

    // Prepare the update object
    const updateCategory = {
      CategoryId,
      categoryName,
    };

    // Try to update the category
    const updateSingleCategory = await category.updateOne(
      { CategoryId: req.params.categoryId },
      { $set: updateCategory }
    );

    // Check if the category was found and updated
    if (updateSingleCategory.nModified === 0) {
      return res
        .status(404)
        .json({ message: "Category not found or no changes made." });
    }

    // Return success response
    res.status(200).json({
      message: "Category updated successfully",
      data: updateSingleCategory,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error occurred while updating category:", error);

    // Send error response with status code and error message
    res
      .status(500)
      .json({ message: "Failed to update category", error: error.message });
  }
};

//------------------------------------------------------------------------------------
//-----------   Delete category by cart id ,delete request   /delete-cart/:cartId
//---------------------------------------------------------------------------------------
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const deletedCategory = await category.findOneAndDelete({
      CategoryId: categoryId,
    });

    if (deletedCategory) {
      res.send("Category deleted successfully");
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    console.error("Failed to delete Category:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addCategory,
  getCategory,
  editCategory,
  getSingleCategory,
  deleteCategory,
};
