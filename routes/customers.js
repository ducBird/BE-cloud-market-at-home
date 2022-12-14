var express = require("express");
var router = express.Router();
const yup = require("yup");

const { validateSchema } = require("../schemas");
const { default: mongoose } = require("mongoose");
const { Customer } = require("../models");

const { CONNECTION_STRING } = require("../constants/connectionDB");

//MONGOOSE
mongoose.connect(CONNECTION_STRING);

//JWT
var passport = require("passport");
var jwt = require("jsonwebtoken");
const jwtSettings = require("../constants/jwtSettings");

//MONGODB
const { findDocuments, findDocument } = require("../helpers/MongoDbHelper");

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
  if (getId === "search" || getId === "authentication" || getId === "roles") {
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

// LOGIN VALIDATE | TEST LOGIN WITH BODY  ---------- //
const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(() => {
      return "L???i ....";
    }),
  }),
});

// TEST LOGIN WITH JWT ---------- //
router.post(
  "/login-jwt",
  validateSchema(loginSchema),
  async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log("* email: ", email);
    console.log("* password: ", password);

    const found = await findDocuments(
      {
        query: {
          email: email,
          password: password,
        },
      },
      "customers"
    );
    console.log(found);

    if (found && found.length > 0) {
      const id = found[0]._id.toString();
      const _id = found[0]._id;
      // login: OK
      // jwt | token grant
      var payload = {
        // th??ng tin trong bi???n n??y s??? ???????c in khi c???p token
        user: {
          email: email,
          fullName: "End User",
        },
        application: "ecommerce",
        message: "payload",
      };

      var secret = jwtSettings.SECRET;

      var token = jwt.sign(payload, secret, {
        expiresIn: 86400, // expires in 24 hours (24 x 60 x 60)
        audience: jwtSettings.AUDIENCE,
        issuer: jwtSettings.ISSUER,
        subject: id, // Th?????ng d??ng ????? ki???m tra JWT l???n sau
        algorithm: "HS512",
      });

      // REFRESH TOKEN
      const refreshToken = jwt.sign(
        {
          id,
        },
        secret,
        {
          expiresIn: "365d", // expires in 24 hours (24 x 60 x 60) //key word 'expiresIn day string jwt'
        }
      );

      res.send({ message: "Login success!", token, refreshToken, _id });
      return;
    }
    res.status(401).send({ message: "Login failed!" });
  }
);

router.post("/refresh-token", async (req, res, next) => {
  const { refreshToken } = req.body;
  jwt.verify(refreshToken, jwtSettings.SECRET, async (err, decoded) => {
    if (err) {
      // return res.sendStatus(406);
      return res.status(401).json({ message: "refreshToken is invalid" });
    } else {
      console.log("???? decoded", decoded);
      const { id } = decoded;
      const user = await findDocument(id, "customers");
      if (user && user.active) {
        const secret = jwtSettings.SECRET;

        const payload = {
          message: "payload",
        };

        const token = jwt.sign(payload, secret, {
          expiresIn: 86400, //24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
          audience: jwtSettings.AUDIENCE,
          issuer: jwtSettings.ISSUER,
          subject: id, // Th?????ng d??ng ????? ki???m tra JWT l???n sau
          algorithm: "HS512",
        });

        return res.json({ token });
      }
      return res.sendStatus(401);
    }
  });
});

router.get(
  "/authentication",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send("Authentication OK");
  }
);

//============================END MONGOOSE============================//

//============================BEGIN MONGODB============================//
/**
 * import query mongodb
 * const { ...methods } = require('../helpers/MongoDbHelper');
 */

//QUETIONS 4-----------------------------
//Hi???n th??? t???t c??? c??c kh??ch h??ng c?? ?????a ch??? ??? Qu???n H???i Ch??u
router.get("/questions/4", async (req, res, next) => {
  try {
    const text = "H???i Ch??u";
    let query = { address: new RegExp(`${text}`) };
    const results = await findDocuments({ query: query }, "customers");
    res.json({ ok: true, results });
  } catch (error) {
    res.status(500).json(error);
  }

  // const text = 'H???i Ch??u';
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
//Hi???n th??? t???t c??? c??c kh??ch h??ng c?? n??m sinh 1990
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
//Hi???n th??? t???t c??? c??c kh??ch h??ng c?? sinh nh???t l?? h??m nay
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
