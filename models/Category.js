const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const categorySchema = new Schema({
  name: { type: String, required: [true, "Name bắt buộc phải nhập"] },
  imageURL: String,
  description: String,
});

const Category = model("Category", categorySchema);

module.exports = Category;
