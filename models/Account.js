const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const accountSchema = new Schema({
  username: {
    type: String,
    required: [true, "username bắt buộc phải nhập"],
    validate: {
      validator: function (value) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
      message: `{VALUE} là một email không hợp lệ`,
      // message: (props) => `{props.value} is not a valid email!`,
    },
  },
  password: { type: String, required: [true, "password bắt buộc phải nhập"] },
  fullName: {
    type: String,
    required: [true, "Tên người dùng bắt buộc phải nhập"],
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (value) {
        const phoneNumberRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        return phoneNumberRegex.test(value);
      },
      message: `{VALUE} không hợp lệ ở Việt Nam`,
    },
  },
  active: Boolean,
  roles: [],
});

const Account = model("Account", accountSchema);

module.exports = Account;
