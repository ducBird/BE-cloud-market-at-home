const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const employeeSchema = new Schema({
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
        const phoneNumberRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        return phoneNumberRegex.test(value);
      },
      message: `{VALUE} không phải là số điện thoại hợp lệ`,
    },
  },
  address: { type: String, required: [true, "Địa chỉ bắt buộc phải nhập"] },
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
  },
  password: { type: String },
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
  active: { type: Boolean, default: true },
  roles: { type: [], default: ["sales"] },
  isDelete: { type: Boolean, default: false },
});

// Virtuals
employeeSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

employeeSchema.set("toJSON", { virtuals: true });
employeeSchema.set("toObject", { virtuals: true });

const Employee = model("Employee", employeeSchema);

module.exports = Employee;
