require("../DataBase/DbConnection");
const carts = require("../Modal/Cart-Modal");

//--------------------------------------------------------------------------------------------
//------   Add  cart , post request ,  /add-cart
//--------------------------------------------------------------------------------------------
const addCart = async (req, res) => {
  try {
    const newCart = new carts(req.body);
    const createCart = await newCart.save();

    res.send(createCart);
    console.log(createCart);
  } catch (error) {
    console.log(" failed to add new cart", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------  get all cart , get request ,  /get-cart
//--------------------------------------------------------------------------------------------
const getCart = async (req, res) => {
  try {
    const allCarts = await carts.find({});

    res.send(allCarts);
    console.log(allCarts);
  } catch (error) {
    console.log("failed to get cart", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------  get single carts , get request ,  /get-cart/:cartId
//--------------------------------------------------------------------------------------------
const getSingleCart = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const cart = await carts.find({ CustomerId: customerId });
    console.log("customerId", customerId);
    if (cart) {
      res.send(cart);
      console.log(cart);
    } else {
      res.status(404).send("cart not found");
    }
  } catch (error) {
    console.log("failed to get cart", error);
    res.send(error);
  }
};
//--------------------------------------------------------------------------------------------
//------   Edit cart , put request ,  /edit-cart/:cartId
//--------------------------------------------------------------------------------------------
const editCart = async (req, res) => {
  try {
    const updateCart = {
      CartId: req.body.CartId,
      CustomerId: req.body.CustomerId,
      ProductName: req.body.ProductName,
      Price: req.body.Price,
      Quantity: req.body.Quantity,
      Image: req.body.Image,
    };
    const updateSingleCart = await carts.updateOne(
      { ProductId: req.params.productId },
      { $set: updateCart }
    );

    res.send(updateSingleCart);
    console.log(updateSingleCart);
  } catch (error) {
    console.log("failed to updated cart", error);
    res.send(error);
  }
};
//------------------------------------------------------------------------------------
//-----------   Delete cart by cart id ,delete request   /delete-cart/:cartId
//---------------------------------------------------------------------------------------
const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const deletedCart = await carts.findOneAndDelete({ CartId: cartId });

    if (deletedCart) {
      res.send("cart deleted successfully");
      console.log("cart product:", deletedCart);
    } else {
      res.status(404).send("cart not found");
    }
  } catch (error) {
    console.error("Failed to delete cart:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { addCart, getCart, editCart, getSingleCart, deleteCart };
