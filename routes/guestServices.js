var express = require("express");
var router = express.Router();

const { default: mongoose } = require("mongoose");
const { GuestService } = require("../models");

//MONGOOSE
// mongoose.connect("mongodb://127.0.0.1:27017/cloud-market-AH");
const { CONNECTION_STRING } = require("../constants/connectionDB");

//MONGOOSE
mongoose.connect(CONNECTION_STRING);

//MONGODB
// const { findDocuments } = require('../helpers/MongoDbHelper');
const passport = require("passport");

//============================BEGIN MONGOOSE============================//

/* GET list dataCategories. */
router.get("/", function (req, res, next) {
  try {
    GuestService.find().then((result) => {
      res.send(result);
      // console.log(result);
    });
  } catch (error) {
    // console.log(error);
    res.sendStatus(500);
  }
});

/* GET item at dataCategories. */
router.get("/:id", function (req, res, next) {
  if (req.params.id === "search") {
    next();
    return;
  }
  try {
    const { id } = req.params;
    GuestService.findById(id).then((result) => {
      // console.log(result);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

/* Search item dataCategories. */
// router.get('/search/name', function (req, res, next) { hoặc như phía dưới nhưng phải kiểm tra điều kiện ở những url phía trên để tránh trùng lặp url chỗ 'next'
router.get("/search", function (req, res, next) {
  const { id, name } = req.query;
  console.log(id);
  console.log(name);
  res.send("OK");
});

/* POST insert item at dataCategories. */
router.post("/", function (req, res, next) {
  try {
    const data = req.body;
    const newItem = new GuestService(data);
    newItem.save().then((result) => {
      // console.log(result);
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

/* PATCH updated item at dataCategories. */
router.patch("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    GuestService.findByIdAndUpdate(id, data, {
      new: true,
    }).then((result) => {
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

/* DELETE remove item at dataCategories. */
router.delete("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    GuestService.findByIdAndDelete(id).then((result) => {
      // console.log(result);
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//============================END MONGOOSE============================//

//============================BEGIN MONGODB============================//
/**
 * import query mongodb
 * const { ...methods } = require('../helpers/MongoDbHelper');
 */

//QUETIONS 4-----------------------------

//============================END MONGODB============================//

module.exports = router;
