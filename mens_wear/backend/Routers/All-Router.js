const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../authMiddleware");
const {
  login,
  logout,
  refreshToken,
} = require("../Controller/Login-Controller");
// const { login } = require("../Routers/login");  // uncomment this if u want to use Oauth login, and coomemt above
const { oAuth } = require("../Routers/oauth");
const { callBack } = require("../Routers/callback");
const { concent } = require("../Routers/concent");
// const { refreshToken } = require("../Routers/refreshToken");
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
  getAllProductsGroupedByCategory,
  getFeaturedProduct,
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
//=======================================================================================
router.route("/").get(home);
router.route("/register-customer").post(registerCustomer);
router.route("/get-customer").get(authorizeRoles([1]), getAllCustomer);
router
  .route("/edit-customer/:customerId")
  .put(authorizeRoles([1, 3]), editCustomer);
router
  .route("/get-customer/:customerId")
  .get(authorizeRoles([1, 3]), getSingleCustomer);
router
  .route("/delete-customer/:customerId")
  .delete(authorizeRoles([1]), deleteCustomer);

//-------------------------------------------------------------------------------------
//--------- Products Routes
//-------------------------------------------------------------------------------------
router.route("/add-product").post(authorizeRoles([1]), addProduct);
router.route("/get-product").get(authorizeRoles([1, 3]), getProduct);
router.route("/get-featured-product").get(getFeaturedProduct);
router
  .route("/get-product/:productId")
  .get(authorizeRoles([1, 3]), getSingleProduct);
router.route("/edit-product/:productId").put(authorizeRoles([1]), editproduct);
router
  .route("/delete-product/:productId")
  .delete(authorizeRoles([1]), deleteProduct);
router.route("/get-products-grouped").get(getAllProductsGroupedByCategory);
//-------------------------------------------------------------------------------------
//--------- Cart Routes
//-------------------------------------------------------------------------------------
router.route("/add-cart").post(authorizeRoles([1, 3]), addCart);
router.route("/get-cart").get(authorizeRoles([1]), getCart);
router.route("/get-cart/:userId").get(authorizeRoles([1, 3]), getSingleCart);
router.route("/edit-cart/:cartId").put(authorizeRoles([1, 3]), editCart);
router.route("/delete-cart/:cartId").delete(authorizeRoles([1, 3]), deleteCart);
router.route("/confirm-cart/:cartId").put(authorizeRoles([1, 3]), confirmOrder);

//-------------------------------------------------------------------------------------
//--------- Vendor Routes
//-------------------------------------------------------------------------------------
router.route("/add-vendor").post(authorizeRoles([1]), addVendor);
router.route("/get-vendor").get(authorizeRoles([1]), getVendor);
router
  .route("/get-vendor/:vendorId")
  .get(authorizeRoles([1, 2]), getSingleVendor);
router.route("/edit-vendor/:vendorId").put(authorizeRoles([1, 2]), editVendor);
router
  .route("/delete-vendor/:vendorId")
  .delete(authorizeRoles([1]), deleteVendor);
router
  .route("/get-vendorCategory/:categoryId")
  .get(authorizeRoles([1]), getSingleVendorByCategoryId);

//-------------------------------------------------------------------------------------
//--------- Category Routes
//-------------------------------------------------------------------------------------
router.route("/add-category").post(authorizeRoles([1]), addCategory);
router.route("/get-category").get(authorizeRoles([1, 3]), getCategory);
router
  .route("/get-products-by-category/:categoryId")
  .get(authorizeRoles([1, 3]), getSingleCategory);
router
  .route("/edit-category/:categoryId")
  .put(authorizeRoles([1]), editCategory);
router
  .route("/fetch-category/:categoryId")
  .get(authorizeRoles([1, 3]), getCategoryDetails);
router
  .route("/delete-category/:categoryId")
  .delete(authorizeRoles([1]), deleteCategory);
//===================================================================================
router
  .route("/get-feedback/:userId")
  .get(authorizeRoles([1, 3]), getFeedbackByUser);
router
  .route("/add-feedback")
  .post(authorizeRoles([1, 3]), submitOrUpdateFeedback);
router
  .route("/update-feedback")
  .put(authorizeRoles([1, 3]), submitOrUpdateFeedback);
router.route("/all-feedbacks").get(authorizeRoles([1]), getAllFeedback);

// Contact Routes
router.route("/add-contact").post(authorizeRoles([1, 3]), submitContactMessage);
router.route("/all-contacts").get(authorizeRoles([1]), getAllContacts);
//===================================================================
router.route("/login").post(login);
router.route("/refreshToken").post(refreshToken);
router.route("/logout").post(logout);
router.route("/authorize").get(oAuth);
router.route("/consent").get(concent);
router.route("/callback").get(callBack);
// router.route("/refreshToken").post(refreshToken);

module.exports = router;
