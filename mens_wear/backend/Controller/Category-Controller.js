require("../DataBase/DbConnection");
const category = require("../Modal/Categories-Modal");

//--------------------------------------------------------------------------------------------
//------   Add  category , post request ,  /add-category
//-------------------------------------------------------------------------------`-------------
const addCategory = async (req, res) => {
  try {
    const newCategory = new category(req.body);
    const createCategory = await newCategory.save();

    res.send(createCategory);
    console.log(createCategory);
  } catch (error) {
    console.log(" failed to add new category", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------  get all category , get request ,  /get-category
//--------------------------------------------------------------------------------------------
const getCategory = async (req, res) => {
  try {
    const allCategory = await category.find({});

    res.send(allCategory);
    console.log(allCategory);
  } catch (error) {
    console.log("failed to get category", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------  get single category , get request ,  /get-category/:categoryId
//--------------------------------------------------------------------------------------------
const getSingleCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await category.findOne({ CategoryId: categoryId });

    if (category) {
      res.send(category);
      console.log(category);
    } else {
      res.status(404).send("category not found");
    }
  } catch (error) {
    console.log("failed to get category", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------   Edit category , put request ,  /edit-category/:categoryId
//--------------------------------------------------------------------------------------------
const editCategory = async (req, res) => {
  try {
    const updateCategory = {
      CategoryId: req.body.CategoryId,
      CategoryName: req.body.CategoryName,
    };
    const updateSingleCategory = await category.updateOne(
      { CategoryId: req.params.categoryId },
      { $set: updateCategory }
    );

    res.send(updateSingleCategory);
    console.log(updateSingleCategory);
  } catch (error) {
    console.log("failed to updated category", error);
    res.send(error);
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
      console.log("deleted Category:", deletedCart);
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
