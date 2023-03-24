var express = require("express");
var router = express.Router();
var moment = require("moment");

const { default: mongoose } = require("mongoose");
const { Order } = require("../models");
const { Product } = require("../models");

const { CONNECTION_STRING } = require("../constants/connectionDB");
var NumberInt = require("mongodb").Int32;
//MONGOOSE
mongoose.connect(CONNECTION_STRING);

//MONGODB
const { findDocuments } = require("../helpers/MongoDbHelper");
const passport = require("passport");

//============================BEGIN MONGOOSE============================//

/* GET data Orders. */
router.get("/", function (req, res, next) {
  try {
    Order.find()
      .sort({ createdDate: -1 })
      .populate("orderDetails.product")
      .populate("customer")
      .populate("employee")
      .then((result) => {
        res.send(result);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// GET data Order
router.get("/:id", function (req, res, next) {
  const getId = req.params.id;
  if (getId === "search") {
    next();
    return;
  }
  try {
    // const id = '636404585452ff76b963e61d';
    const id = req.params.id;
    Order.findById(id)
      .populate("orderDetails.product")
      .populate("customer")
      .populate("employee")
      .then((result) => {
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

// Search Order
router.get("/search", (req, res, next) => {
  const { id, firstName, lastName } = req.query;
  console.log(`id: ${id}`);
  res.send("OK query string");
});

//Insert Order
router.post("/", (req, res, next) => {
  try {
    const data = req.body;
    //console.log(data.orderDetails);
    const newItem = new Order(data);
    newItem.save().then((result) => {
      // xử lý cập nhật số lượng khi đặt hàng thành công
      data.orderDetails.forEach((item) => {
        Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          {
            new: true,
          }
        ).then((result) => {
          //console.log(result);
          return;
        });
      });
      res.send(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//Update Order
router.patch("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Order.findByIdAndUpdate(id, data, {
      new: true,
    }).then((result) => {
      res.send(result);
      console.log(result);
      return;
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

//Remove Order
router.delete("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    Order.findByIdAndDelete(id).then((result) => {
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

//QUETIONS 7-----------------------------

//QUETIONS 8-----------------------------
//Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED trong ngày hôm nay
router.post("/questions/8", function (req, res, next) {
  const today = new Date();
  let { status } = req.body;
  let query = {
    $expr: {
      $and: [
        {
          $eq: [{ $dayOfMonth: "$createdDate" }, { $dayOfMonth: today }],
        },
        {
          $eq: [{ $month: "$createdDate" }, { $month: today }],
        },
        {
          $eq: [{ $year: "$createdDate" }, { $year: today }],
        },
        {
          $eq: ["$status", status],
        },
      ],
    },
  };
  findDocuments({ query: query }, "orders")
    .then((result) => {
      res.json(result);
      return;
    })
    .catch((errors) => {
      res.status(500).json(errors);
      return;
    });
});

//QUETIONS 9-----------------------------
//Hiển thị tất cả các đơn hàng có trạng thái là CANCELED
router.get("/questions/9", function (req, res, next) {
  const orderStatus = "WAITING";
  let query = {
    $expr: {
      $eq: ["$status", orderStatus],
    },
  };

  findDocuments({ query: query }, "orders")
    .then((result) => {
      res.json(result);
      return;
    })
    .catch((errors) => {
      res.status(500).json(errors);
      return;
    });
});

//QUETIONS 10-----------------------------
//Hiển thị tất cả các đơn hàng có trạng thái là CANCELED trong ngày hôm nay
router.get("/questions/10", function (req, res, next) {
  const today = new Date();
  const orderStatus = "WAITING";
  let query = {
    $expr: {
      $and: [
        { $eq: [{ $dayOfMonth: "$createdDate" }, { $dayOfMonth: today }] },
        { $eq: [{ $month: "$createdDate" }, { $month: today }] },
        { $eq: [{ $year: "$createdDate" }, { $year: today }] },
        { $eq: ["$status", orderStatus] },
      ],
    },
  };

  findDocuments({ query: query }, "orders")
    .then((result) => {
      res.json(result);
      return;
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//QUETIONS 11-----------------------------
//Hiển thị tất cả các đơn hàng có hình thức thanh toán là CASH
router.get("/questions/11", function (req, res, next) {
  const orderPayment = "CASH";
  let query = {
    paymentType: { $eq: orderPayment },
  };
  findDocuments({ query: query }, "orders")
    .then((result) => {
      res.json(result);
      return;
    })
    .catch((err) => {
      res.status(500).json(err);
      return;
    });
});

//QUETIONS 12-----------------------------
//Hiển thị tất cả các đơn hàng có hình thức thanh toán là CREDIT CARD
router.get("/questions/12", function (req, res, next) {
  const orderPayment = "CREDIT CARD";
  let query = {
    $expr: {
      $eq: ["$paymentType", orderPayment],
    },
  };
  findDocuments({ query: query }, "orders")
    .then((result) => {
      res.json(result);
      return;
    })
    .catch((err) => {
      res.status(500).json(err);
      return;
    });
});

//QUETIONS 13-----------------------------
//Hiển thị tất cả các đơn hàng có địa chỉ giao hàng là Hà Nội
router.get("/questions/13", function (req, res, next) {
  const orderAddress = "Quảng Nam";
  let query = {
    shippingAddress: { $eq: orderAddress },
  };
  findDocuments({ query: query }, "orders")
    .then((result) => {
      res.json(result);
      return;
    })
    .catch((err) => {
      res.status(500).json(err);
      return;
    });
});

// query 1
//Hiển thị tất cả các đơn hàng trùng với số điện thoại vừa nhập
router.post("/tim-kiem-theo-so-dien-thoai", function (req, res, next) {
  let { phoneNumber } = req.body;
  let query = {
    phoneNumber: { $eq: phoneNumber },
  };
  Order.find(query)
    .populate("orderDetails.product")
    .then((result) => {
      res.json(result);
      return;
    })
    .catch((err) => {
      res.status(500).json(err);
      return;
    });
});

// query 2
// hiển thị đơn hàng trùng với ngày nhập vào
// lỗi
router.post("/tim-don-hang-theo-ngay", function (req, res, next) {
  let { createdDate } = req.body;
  const query = {
    createdDate: createdDate,
  };
  try {
    Order.find(query)
      .populate("orderDetails.product")
      .populate("customer")
      .populate("employee")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

// query 3
//Hiển thị tất cả các đơn hàng theo trạng thái
router.post("/thong-ke-don-hang-theo-trang-thai", function (req, res, next) {
  let { status } = req.body;
  const query = {
    status: status,
  };
  // findDocuments({ query: query }, 'orders')
  //   .then((result) => {
  //     res.json(result);
  //     return;
  //   })
  //   .catch((err) => {
  //     res.status(500).json(err);
  //     return;
  //   });
  try {
    Order.find(query)
      .populate("orderDetails.product")
      .populate("customer")
      .populate("employee")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

// query 4
//Hiển thị tất cả các đơn hàng theo trạng thái
router.post(
  "/thong-ke-don-hang-theo-hinh-thuc-thanh-toan",
  function (req, res, next) {
    let { paymentType } = req.body;
    const query = {
      paymentType: paymentType,
    };
    try {
      Order.find(query)
        .populate("orderDetails.product")
        .populate("customer")
        .populate("employee")
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(400).send({ message: err.message });
        });
    } catch (err) {
      res.sendStatus(500);
    }
  }
);
// query 5
//Hiển thị tất cả các đơn hàng theo giá
router.post("/thong-ke-don-hang-theo-tong-don-hang", function (req, res, next) {
  let { totalSearch } = req.body;

  Order.aggregate([
    { $unwind: { path: "$products" } },
    { $group: { _id: "$_id", total: { $sum: "$products.price" } } },
    { $match: { total: { $gte: NumberInt(100000) } } },
  ]);
  try {
    Order.find(query)
      .populate("orderDetails.product")
      .populate("customer")
      .populate("employee")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});
//============================END MONGODB============================//

module.exports = router;
