const mongoose = require("mongoose");
const { Schema, model } = mongoose;

//import and setup mongoose-lean-virtual
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const productSchema = new Schema(
  {
    name: { type: String, required: [true, "Tên sản phẩm bắt buộc nhập"] },
    imageProduct: String,
    price: {
      type: Number,
      required: [true, "Giá bắt buộc nhập"],
      min: [0, "Giá phải lớn hơn 0"],
    },
    discount: {
      type: Number,
      min: [0, "Giảm giá phải lớn hơn bằng 0"],
      max: [100, "Giảm giá phải nhỏ hơn bằng 0"],
    },
    stock: {
      type: Number,
      required: [true, "Tồn kho bắt buộc nhập"],
      min: [0, "Tồn kho phải lớn hơn bằng 0"],
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
    isDelete: { type: Boolean, default: false },
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
