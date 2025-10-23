const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Config/CloudinaryConfig");
// const path = require("path");

// // Configure storage for uploaded files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "UploadedFiles/"); // Save files in the "UploadedFiles" directory
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mens_wear", // Folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed file types
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

// File filter: only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Single image upload (e.g., profile picture)
const uploadSingle = multer({
  storage,
  fileFilter,
}).single("Image"); // field name must match frontend form

// Multiple image upload (e.g., product gallery)
const upload = multer({
  storage,
  fileFilter,
}).array("Image", 5); // max 5 images

module.exports = { uploadSingle, upload };
