const multer = require("multer");
const path = require("path");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "UploadedFiles/"); // Save files in the "UploadedFiles" directory
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// File filter: Only accept image files (JPEG, PNG, etc.)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    // lowercase "image"
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure multer for multiple image uploads (up to 5 images)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).array("Image", 5); // Change '5' to the max number of images you allow

module.exports = upload;
