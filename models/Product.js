const mongoose = require("mongoose");
const { Schema, model } = mongoose;

//import and setup mongoose-lean-virtual
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const productSchema = new Schema(
  {
    name: { type: String, required: [true, "Name product is require"] },
    imageProduct: String,
    price: {
      type: Number,
      required: [true, "Price is require"],
      min: [0, "Must be at least 0, got {VALUE}"],
    },
    discount: {
      type: Number,
      required: [true, "Discount product is require"],
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
    },
    dram: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    description: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

//Virtuals
productSchema.virtual("total").get(function () {
  return (this.price * (100 - this.discount)) / 100;
});

// Virtual with Populate
productSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});
productSchema.virtual("supplier", {
  ref: "Supplier",
  localField: "supplierId",
  foreignField: "_id",
  justOne: true,
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

productSchema.plugin(mongooseLeanVirtuals);

const Product = model("Product", productSchema);

module.exports = Product;
