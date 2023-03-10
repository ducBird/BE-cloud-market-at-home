const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const customerSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "Họ - Tên đệm bắt buộc phải nhập"],
  },
  lastName: { type: String, required: [true, "Tên bắt buộc phải nhập"] },
  avatar: {
    type: String,
    default: "/uploads/img/customers/customer_feedback.png",
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (value) {
        const phoneNumberRegex =
          /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
        return phoneNumberRegex.test(value);
      },
      message: `{VALUE} không phải là số điện thoại hợp lệ`,
    },
  },
  address: { type: String },
  email: {
    type: String,
    required: [true, "Email bắt buộc phải nhập"],
    validate: {
      validator: function (value) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
      message: `{VALUE} không phải là email hợp lệ`,
      // message: (props) => `{props.value} is not a valid email!`,
    },
    unique: [true, "email đã tồn tại"],
  },
  password: { type: String },
  googleId: { type: String },
  birthDay: {
    type: Date,
    // validate: {
    //   validator: function (value) {
    //     const dateTimeRegex =
    //       /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/;
    //     return dateTimeRegex.test(value);
    //   },
    //   message: `valid date in the format dd/mm/yyyy , dd-mm-yyyy or dd.mm.yyyy`,
    // },
    validate: {
      validator: function (value) {
        if (!value) return true;
        if (value >= Date.now()) return false;
        return true;
      },
      message: "Ngày hợp lệ ở định dạng yyyy/dd/mm",
    },
  },
  accountType: { type: String, default: "email" },
  active: { type: Boolean, default: true },
  roles: { type: [], default: ["customer"] },
  isDelete: { type: Boolean, default: false },
});

// Virtuals
customerSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

customerSchema.set("toJSON", { virtuals: true });
customerSchema.set("toObject", { virtuals: true });

const Customer = model("Customer", customerSchema);

module.exports = Customer;
