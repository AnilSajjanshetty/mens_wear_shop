const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const validator = require("validator");
const sanitizeHtml = require("sanitize-html"); // ✅ Import sanitize-html

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    minlength: [3, "Category name must be at least 3 characters long"],
    maxlength: [50, "Category name cannot exceed 50 characters"],
    set: (value) =>
      sanitizeHtml(value, {
        allowedTags: [], // ❌ No HTML tags allowed
        allowedAttributes: {}, // ❌ No attributes allowed
      }).toLowerCase(), // ✅ Sanitize & convert to lowercase
  },
});

// Apply auto-increment plugin for CategoryId
categorySchema.plugin(AutoIncrement, { inc_field: "CategoryId" });

const category = mongoose.model("category", categorySchema);

module.exports = category;
