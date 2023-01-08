var express = require("express");
var router = express.Router();

const { default: mongoose } = require("mongoose");
const { Supplier } = require("../models");

const { CONNECTION_STRING } = require("../constants/connectionDB");

//MONGOOSE
mongoose.connect(CONNECTION_STRING);

//MONGODB
const { findDocuments } = require("../helpers/MongoDbHelper");
const passport = require("passport");

//============================BEGIN MONGOOSE============================//

/* GET data Suppliers. */
router.get("/", function (req, res, next) {
  try {
    Supplier.find()
      .sort({ name: 1 })
      .then((result) => {
        res.send(result);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// GET data Supplier
router.get("/:id", function (req, res, next) {
  const getId = req.params.id;
  if (getId === "search") {
    next();
    return;
  }
  try {
    // const id = '636404585452ff76b963e61d';
    const id = req.params.id;
    Supplier.findById(id).then((result) => {
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

// Search Supplier
router.get("/search", (req, res, next) => {
  const { id, firstName, lastName } = req.query;
  console.log(`id: ${id}`);
  res.send("OK query string");
});

//Insert Supplier
router.post("/", (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Supplier(data);
    newItem.save().then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//Update Supplier
router.patch("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Supplier.findByIdAndUpdate(id, data, {
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

//Remove Supplier
router.delete("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    Supplier.findByIdAndDelete(id).then((result) => {
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

//============================END MONGODB============================//

module.exports = router;
