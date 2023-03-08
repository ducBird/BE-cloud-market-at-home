const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// ========================Begin OrderDetail================================

const orderDetailSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, require: true, min: 0 },
});
// Virtual with Populate
orderDetailSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

orderDetailSchema.set("toJSON", { virtuals: true });
orderDetailSchema.set("toObject", { virtuals: true });

// ========================End OrderDetail================================

// ========================Begin Order================================

const orderSchema = new Schema({
  createdDate: {
    type: Date,
    required: [true, "Ngày tạo hóa đơn bắt buộc phải nhập"],
    default: new Date(),
  },

  shippedDate: {
    type: Date,
    validate: {
      validator: function (value) {
        if (!value) return true;
        if (value < this.createdDate) {
          return false;
        }
        return true;
      },
      message: `Ngày vận chuyển: {VALUE} không hợp lệ!`,
    },
  },
  status: {
    type: String,
    required: [true, "Trạng thái bắt buộc phải nhập"],
    default: "WAITING CONFIRMATION ORDER",
    validate: {
      validator: (value) => {
        if (
          [
            "WAITING CONFIRMATION ORDER",
            "WAITING PICKUP ORDER",
            "SHIPPING CONFIRMATION",
            "DELIVERY IN PROGESS",
            "DELIVERY SUCCESS",
            "CANCELED ORDER",
          ].includes(value)
        ) {
          return true;
        }
        return false;
      },
      message: `Trạng thái: {VALUE} không hợp lệ!`,
    },
    // validate: {
    //   validator: (value) => {
    //     if (
    //       value !== "WAITING CONFIRMATION ORDER" &&
    //       value !== "WAITING PICKUP ORDER" &&
    //       value !== "SHIPPING CONFIRMATION" &&
    //       value !== "DELIVERY IN PROGESS" &&
    //       value !== "DELIVERY SUCCESS" &&
    //       value !== "CANCELED ORDER"
    //     ) {
    //       return false;
    //     }
    //     return true;
    //   },
    //   message: `Trạng thái: {VALUE} không hợp lệ!`,
    // },
  },
  description: String,

  shippingAddress: {
    type: String,
    required: [true, "Địa chỉ giao hàng bắt buộc phải nhập"],
  },

  paymentType: {
    type: String,
    required: [true, "Hình thức thanh toán bắt buộc phải nhập"],
    default: "CASH",
    validate: {
      validator: (value) => {
        if (["MOMO", "CASH"].includes(value)) {
          return true;
        }
        return false;
      },
      message: `Hình thức thanh toán: {VALUE} không hợp lệ!`,
    },
    // validate: {
    //   validator: (value) => {
    //     if (value !== "MOMO" && value !== "CASH") {
    //       return false;
    //     }
    //     return true;
    //   },
    //   message: `Hình thức thanh toán: {VALUE} không hợp lệ!`,
    // },
  },

  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: false,
  },

  // tên
  fullName: {
    type: String,
    required: false,
  },

  // số điện thoại
  phoneNumber: {
    type: String,
    required: false,
  },

  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: false,
  },
  orderDetails: [orderDetailSchema],
});
// Virtual with Populate
orderSchema.virtual("customer", {
  ref: "Customer",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("employee", {
  ref: "Employee",
  localField: "employeeId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

// ========================End Order================================

const Order = model("Order", orderSchema);

module.exports = Order;
