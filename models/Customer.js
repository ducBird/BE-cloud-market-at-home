const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const customerSchema = new Schema({
  firstName: { type: String, required: [true, "First name is not valid"] },
  lastName: { type: String, required: [true, "Last name is require"] },
  avatar: String,
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
  passWord: { type: String, required: [false, `Address is required`] },
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
      message: "valid date in the format yyyy/dd/mm",
    },
  },
});

// Virtuals
customerSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

customerSchema.set("toJSON", { virtuals: true });
customerSchema.set("toObject", { virtuals: true });

const Customer = model("Customer", customerSchema);

module.exports = Customer;
