const express = require("express");
const router = express.Router();
const { login, logout } = require("../Controller/Login-Controller");
// const { login } = require("../Routers/login");  // uncomment this if u want to use Oauth login, and coomemt above
const { oAuth } = require("../Routers/oauth");
const { callBack } = require("../Routers/callback");
const { concent } = require("../Routers/concent");
const { refreshToken } = require("../Routers/refreshToken");
const {
  getFeedbackByUser,
  submitOrUpdateFeedback,
  getAllFeedback,
} = require("../Controller/Feedback-Conteoller");
const {
  getAllContacts,
  submitContactMessage,
} = require("../Controller/Contact-Controller");
const {
  home,
  registerCustomer,
  getAllCustomer,
  editCustomer,
  deleteCustomer,
  getSingleCustomer,
} = require("../Controller/Customer-Controller");
const {
  addProduct,
  getProduct,
  editproduct,
  getSingleProduct,
  deleteProduct,
} = require("../Controller/Prodoct-Controller");
const {
  addCart,
  getCart,
  editCart,
  getSingleCart,
  deleteCart,
  confirmOrder,
} = require("../Controller/Cart-Controller");
const {
  addVendor,
  getVendor,
  editVendor,
  getSingleVendor,
  deleteVendor,
  getSingleVendorByCategoryId,
} = require("../Controller/Vendor-Controller");
const {
  addCategory,
  getCategory,
  editCategory,
  getSingleCategory,
  deleteCategory,
  getCategoryDetails,
} = require("../Controller/Category-Controller");

//-------------------------------------------------------------------------------------
//--------- Customer Routes
//-------------------------------------------------------------------------------------
router.route("/").get(home);
router.route("/register-customer").post(registerCustomer);
router.route("/get-customer").get(getAllCustomer);
router.route("/edit-customer/:customerId").put(editCustomer);
router.route("/get-customer/:customerId").get(getSingleCustomer);
router.route("/delete-customer/:customerId").delete(deleteCustomer);

//-------------------------------------------------------------------------------------
//--------- Products Routes
//-------------------------------------------------------------------------------------
router.route("/add-product").post(addProduct);
router.route("/get-product").get(getProduct);
router.route("/get-product/:productId").get(getSingleProduct);
router.route("/edit-product/:productId").put(editproduct);
router.route("/delete-product/:productId").delete(deleteProduct);

//-------------------------------------------------------------------------------------
//--------- Cart Routes
//-------------------------------------------------------------------------------------
router.route("/add-cart").post(addCart);
router.route("/get-cart").get(getCart);
router.route("/get-cart/:userId").get(getSingleCart);
router.route("/edit-cart/:cartId").put(editCart);
router.route("/delete-cart/:cartId").delete(deleteCart);
router.route("/confirm-cart/:cartId").put(confirmOrder);

//-------------------------------------------------------------------------------------
//--------- Vendor Routes
//-------------------------------------------------------------------------------------
router.route("/add-vendor").post(addVendor);
router.route("/get-vendor").get(getVendor);
router.route("/get-vendor/:vendorId").get(getSingleVendor);
router.route("/edit-vendor/:vendorId").put(editVendor);
router.route("/delete-vendor/:vendorId").delete(deleteVendor);
router
  .route("/get-vendorCategory/:categoryId")
  .get(getSingleVendorByCategoryId);

//-------------------------------------------------------------------------------------
//--------- Category Routes
//-------------------------------------------------------------------------------------
router.route("/add-category").post(addCategory);
router.route("/get-category").get(getCategory);
router.route("/get-products-by-category/:categoryId").get(getSingleCategory);
router.route("/edit-category/:categoryId").put(editCategory);
router.route("/fetch-category/:categoryId").get(getCategoryDetails);
router.route("/delete-category/:categoryId").delete(deleteCategory);
//===================================================================================
router.route("/get-feedback/:usrId").get(getFeedbackByUser);
router.route("/add-feedback").post(submitOrUpdateFeedback);
router.route("/update-feedback").put(submitOrUpdateFeedback);
router.route("/all-feedback").get(getAllFeedback);

// Contact Routes
router.route("/add-contact").post(submitContactMessage);
router.route("/all-contacts").get(getAllContacts);
//===================================================================
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/authorize").get(oAuth);
router.route("/consent").get(concent);
router.route("/callback").get(callBack);
router.route("/refreshToken").post(refreshToken);

module.exports = router;
