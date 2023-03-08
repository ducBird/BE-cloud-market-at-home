const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const guestServiceSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Tên người dùng bắt buộc phải nhập"],
  },
  email: {
    type: String,
    required: [true, "email bắt buộc phải nhập"],
    validate: {
      validator: function (value) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
      message: `{VALUE} là một email không hợp lệ`,
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
      message: `{VALUE} không hợp lệ ở Việt Nam`,
    },
  },
  isRequest: Boolean,
  message: String,
  isDelete: { type: Boolean, default: false },
});

const GuestService = model("GuestService", guestServiceSchema);

module.exports = GuestService;
