require("../DataBase/DbConnection");
const carts = require("../Modal/Cart-Modal");
const users = require("../Modal/User-Modal");
//--------------------------------------------------------------------------------------------
//------   Add  cart , post request ,  /add-cart
//--------------------------------------------------------------------------------------------
const addCart = async (req, res) => {
  try {
    const {
      UserId,
      ProductId,
      OrderStatus,
      DeliveryStatus,
      PaymentMethod,
      PaymentStatus,
      Quantity,
    } = req.body;

    // Basic validation
    if (!UserId || !ProductId) {
      return res
        .status(400)
        .json({ error: "UserId and ProductId are required" });
    }

    const newCart = new carts({
      UserId,
      ProductId,
      OrderStatus: OrderStatus || "Pending",
      DeliveryStatus: DeliveryStatus || "Not Shipped",
      PaymentMethod: PaymentMethod || null,
      PaymentStatus: PaymentStatus || "Pending",
      Quantity: Quantity,
    });

    const createCart = await newCart.save();
    return res.status(201).json(createCart);
  } catch (error) {
    console.error("Failed to add new cart", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data format" });
    }

    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again." });
  }
};

//--------------------------------------------------------------------------------------------
//------  get all cart , get request ,  /get-cart
//--------------------------------------------------------------------------------------------
const getCart = async (req, res) => {
  try {
    // Fetch cart items with product and category details
    const allCarts = await carts
      .find()
      .populate({
        path: "ProductId",
        model: "product",
        select: "ProductName Price Stock Image CategoryId",
        populate: {
          path: "CategoryId",
          model: "category",
          select: "categoryName",
        },
      })
      .lean(); // Convert Mongoose docs to plain JSON objects

    // Extract unique UserIds from the cart
    const userIds = [...new Set(allCarts.map((cart) => cart.UserId))];

    // Fetch user profiles based on UserId
    const usersData = await users
      .find({ UserId: { $in: userIds } })
      .select("UserId userName Email MobileNo Address")
      .lean();

    // Merge user data and format the response
    const cartWithDetails = allCarts.map((cart) => {
      const userData = usersData.find((user) => user.UserId === cart.UserId);
      return {
        CartId: cart.CartId,
        OrderStatus: cart.OrderStatus,
        DeliveryStatus: cart.DeliveryStatus,
        PaymentMethod: cart.PaymentMethod,
        PaymentStatus: cart.PaymentStatus,
        Quantity: cart.Quantity,
        TransactionId: cart.TransactionId,
        CreatedAt: cart.createdAt,
        UpdatedAt: cart.updatedAt,

        User: userData
          ? {
              UserId: userData.UserId,
              Name: userData.userName,
              Email: userData.Email,
              Mobile: userData.MobileNo,
              Address: userData.Address,
            }
          : null,
        ProductDetails: cart.ProductId
          ? {
              Name: cart.ProductId.ProductName,
              Price: cart.ProductId.Price,
              Stock: cart.ProductId.Stock,
              Category: cart.ProductId.CategoryId
                ? cart.ProductId.CategoryId.categoryName
                : "Unknown",
              Images: cart.ProductId.Image || [],
            }
          : null,
      };
    });

    if (cartWithDetails.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No cart items found" });
    }

    res.status(200).json(cartWithDetails);
  } catch (error) {
    console.error("Failed to get cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//--------------------------------------------------------------------------------------------
//------  get single carts , get request ,  /get-cart/:cartId
//--------------------------------------------------------------------------------------------
const getSingleCart = async (req, res) => {
  try {
    const customerId = req.params.userId;
    const cart = await carts.find({ UserId: customerId });
    if (cart) {
      res.send(cart);
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
    const CartId = req.params.cartId;
    console.log({ CartId });
    const {
      Quantity,
      OrderStatus,
      DeliveryStatus,
      PaymentMethod,
      PaymentStatus,
      TransactionId,
    } = req.body;

    const updateCart = {};

    // ✅ Only update fields that are provided in the request body
    if (Quantity) updateCart.Quantity = Quantity;
    if (OrderStatus) updateCart.OrderStatus = OrderStatus;
    if (DeliveryStatus) updateCart.DeliveryStatus = DeliveryStatus;
    if (PaymentMethod) updateCart.PaymentMethod = PaymentMethod;
    if (PaymentStatus) updateCart.PaymentStatus = PaymentStatus;
    if (TransactionId) updateCart.TransactionId = TransactionId;

    // ✅ Update only if at least one field is being changed
    if (Object.keys(updateCart).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const updatedCart = await carts.findOneAndUpdate(
      { CartId }, // ✅ Ensure correct filtering
      { $set: updateCart },
      { new: true } // ✅ Returns the updated document
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({
      message: "Cart updated successfully",
      updatedCart,
    });
  } catch (error) {
    console.error("Failed to update cart:", error);
    res.status(500).json({ message: "Server error", error });
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
    } else {
      res.status(404).send("cart not found");
    }
  } catch (error) {
    console.error("Failed to delete cart:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { addCart, getCart, editCart, getSingleCart, deleteCart };
