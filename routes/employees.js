var express = require("express");
var router = express.Router();

const { default: mongoose } = require("mongoose");
const { Employee } = require("../models");

const { CONNECTION_STRING } = require("../constants/connectionDB");

//MONGOOSE
mongoose.connect(CONNECTION_STRING);

//MONGODB
const { findDocuments } = require("../helpers/MongoDbHelper");

//============================BEGIN MONGOOSE============================//

/* GET data Employees. */
router.get("/", function (req, res, next) {
  try {
    Employee.find().then((result) => {
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// GET data Employee
router.get("/:id", function (req, res, next) {
  const getId = req.params.id;
  if (getId === "search") {
    next();
    return;
  }
  try {
    // const id = '636404585452ff76b963e61d';
    const id = req.params.id;
    Employee.findById(id).then((result) => {
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

// Search Employee
router.get("/search", (req, res, next) => {
  const { id, firstName, lastName } = req.query;
  console.log(`id: ${id}`);
  res.send("OK query string");
});

//Insert Employee
router.post("/", (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Employee(data);
    newItem.save().then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//Update Employee
router.patch("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Employee.findByIdAndUpdate(id, data, {
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

//Remove Employee
router.delete("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    Employee.findByIdAndDelete(id).then((result) => {
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
