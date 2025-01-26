const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const categorySchema = new mongoose.Schema({
  CategoryName: {
    type: String,
    required: true,
  },
});

// Apply auto-increment plugin for CategoryId
categorySchema.plugin(AutoIncrement, { inc_field: "CategoryId" });

const category = mongoose.model("category", categorySchema);

module.exports = category;
