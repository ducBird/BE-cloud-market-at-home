const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const supplierSchema = new Schema({
  name: { type: String, required: [true, "Supplier bắt buộc phải nhập"] },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
      message: `{VALUE} is not a valid email`,
      // message: (props) => `{props.value} is not a valid email!`,
    },
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (value) {
        const phoneNumberRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        return phoneNumberRegex.test(value);
      },
      message: `{VALUE} is not a valid phone number Vietnamese`,
    },
  },
  address: { type: String, required: [true, `Address is required`] },
  isDelete: { type: Boolean, default: false },
});

const Supplier = model("Supplier", supplierSchema);

module.exports = Supplier;
