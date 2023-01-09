var express = require("express");
var router = express.Router();

const { default: mongoose } = require("mongoose");
const { Product } = require("../models");

const { CONNECTION_STRING } = require("../constants/connectionDB");

//MONGOOSE
mongoose.connect(CONNECTION_STRING);

//MONGODB
const { findDocuments } = require("../helpers/MongoDbHelper");
const passport = require("passport");

//============================BEGIN MONGOOSE============================//

/* GET data Products. */
router.get("/", function (req, res, next) {
  try {
    Product.find()
      .lean({ virtuals: true })
      .populate("category")
      .populate("supplier")
      .then((result) => {
        res.send(result);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

/* GET data Products by categoryId. */
router.get("/:categoryId", function (req, res, next) {
  console.log(req.params);
  const categoryId = req.params.categoryId;
  if (categoryId === "search" || categoryId === "questions") {
    next();
    return;
  }
  try {
    Product.find({ categoryId })
      .lean({ virtuals: true })
      .populate("category")
      .then((result) => {
        res.send(result);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
// GET data Product
router.get("/:categoryId/:id", function (req, res, next) {
  const getId = req.params.id;
  try {
    const id = req.params.id;
    Product.findById(id).then((result) => {
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

// Search Product
router.get("/search", (req, res, next) => {
  const { id, firstName, lastName } = req.query;
  console.log(`id: ${id}`);
  res.send("OK query string");
});

//Insert Product
router.post("/", (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Product(data);
    newItem.save().then((result) => {
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//Update Product
router.patch("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Product.findByIdAndUpdate(id, data, {
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

//Remove Product
router.delete("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    Product.findByIdAndDelete(id).then((result) => {
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
router.get("/questions", async (req, res, next) => {
  try {
    let query = { discount: { $gte: 10 } };
    const results = await findDocuments({ query: query }, "products");
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }
});

//============================END MONGODB============================//
module.exports = router;
