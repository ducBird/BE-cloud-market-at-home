var express = require("express");
var router = express.Router();

const { default: mongoose } = require("mongoose");
const { Customer } = require("../models");

//MONGOOSE
mongoose.connect("mongodb://127.0.0.1:27017/cloud-market-AH");

//MONGODB
const { findDocuments } = require("../helpers/MongoDbHelper");

//============================BEGIN MONGOOSE============================//

/* GET data Customers. */
router.get("/", function (req, res, next) {
  try {
    Customer.find().then((result) => {
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// GET data Customer
router.get("/:id", function (req, res, next) {
  const getId = req.params.id;
  if (getId === "search") {
    next();
    return;
  }
  try {
    // const id = '636404585452ff76b963e61d';
    const id = req.params.id;
    Customer.findById(id).then((result) => {
      // console.log(result);
      res.send(result);
      return;
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

// Search Customer
router.get("/search", (req, res, next) => {
  const { id, firstName, lastName } = req.query;
  console.log(`id: ${id}`);
  res.send("OK query string");
});

//Insert Customer
router.post("/", (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Customer(data);
    newItem.save().then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//Update Customer
router.patch("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Customer.findByIdAndUpdate(id, data, {
      new: true,
    }).then((result) => {
      // console.log(result);
      res.send(result);
      return;
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

//Remove Customer
router.delete("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    Customer.findByIdAndDelete(id).then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
});

//============================END MONGOOSE============================//

//============================BEGIN MONGODB============================//
/**
 * import query mongodb
 * const { ...methods } = require('../helpers/MongoDbHelper');
 */

//QUETIONS 4-----------------------------
//Hiển thị tất cả các khách hàng có địa chỉ ở Quận Hải Châu
router.get("/questions/4", async (req, res, next) => {
  try {
    const text = "Hải Châu";
    let query = { address: new RegExp(`${text}`) };
    const results = await findDocuments({ query: query }, "customers");
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }

  // const text = 'Hải Châu';
  // let query = { address: new RegExp(`${text}`) };
  // findDocuments({ query: query }, 'customers')
  //   .then((results) => {
  //     res.json(results);
  //   })
  //   .catch((err) => {
  //     res.status(500).json(err);
  //   });
});

//QUETIONS 5-----------------------------
//Hiển thị tất cả các khách hàng có năm sinh 1990
router.get("/questions/5", async (req, res, next) => {
  try {
    let query = {
      $expr: { $eq: [{ $year: "$birthDay" }, 2001] },
    };
    const results = await findDocuments({ query: query }, "customers");
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }
});

//QUETIONS 6-----------------------------
//Hiển thị tất cả các khách hàng có sinh nhật là hôm nay
router.get("/questions/6", (req, res, next) => {
  const toDay = new Date();
  const dayBirthDay = {
    $eq: [{ $dayOfMonth: "$birthDay" }, { $dayOfMonth: toDay }],
  };
  const monthBirthday = {
    $eq: [{ $month: "$birthDay" }, { $month: toDay }],
  };
  let query = {
    $expr: {
      $and: [dayBirthDay, monthBirthday],
    },
  };
  findDocuments({ query: query }, "customers")
    .then((result) => {
      res.json(result);
      return;
    })
    .catch((err) => {
      res.status(500).json(err);
      return;
    });
});

//============================END MONGODB============================//

module.exports = router;
