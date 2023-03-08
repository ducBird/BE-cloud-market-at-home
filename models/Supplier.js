const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const supplierSchema = new Schema({
  name: { type: String, required: [true, "Tên nhà cung cấp bắt buộc nhập"] },
  email: {
    type: String,
    required: [true, "Email bắt buộc nhập"],
    validate: {
      validator: function (value) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
      message: `{VALUE} Email không hợp lệ!`,
      // message: (props) => `{props.value} is not a valid email!`,
    },
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (value) {
        const phoneNumberRegex =
          /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
        return phoneNumberRegex.test(value);
      },
      message: `{VALUE} Số điện thoại không hợp lệ`,
    },
  },
  address: { type: String, required: [true, "Địa chỉ bắt buộc nhập"] },
});

const Supplier = model("Supplier", supplierSchema);

module.exports = Supplier;
