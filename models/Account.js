const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const accountSchema = new Schema({
  username: { type: String, required: [true, "username bắt buộc phải nhập"] },
  password: { type: String, required: [true, "password bắt buộc phải nhập"] },
  active: Boolean,
  roles: [],
});

const Account = model("Account", accountSchema);

module.exports = Account;
