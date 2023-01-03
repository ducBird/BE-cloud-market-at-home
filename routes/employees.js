var express = require("express");
var router = express.Router();
const yup = require("yup");

const { validateSchema } = require("../schemas");
const { default: mongoose } = require("mongoose");
const { Employee } = require("../models");

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
  if (getId === "search" || getId === "authentication" || getId === "roles") {
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

// LOGIN VALIDATE | TEST LOGIN WITH BODY  ---------- //
const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(() => {
      return "Lỗi ....";
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
      "employees"
    );
    console.log(found);

    if (found && found.length > 0) {
      const id = found[0]._id.toString();
      const _id = found[0]._id;
      // login: OK
      // jwt | token grant
      var payload = {
        // thông tin trong biến này sẽ được in khi cấp token
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
        subject: id, // Thường dùng để kiểm tra JWT lần sau
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

//  Cấp lại refreshToken mới
router.post("/refresh-token", async (req, res, next) => {
  const { refreshToken } = req.body;
  jwt.verify(refreshToken, jwtSettings.SECRET, async (err, decoded) => {
    if (err) {
      // return res.sendStatus(406);
      return res.status(401).json({ message: "refreshToken is invalid" });
    } else {
      console.log("🍎 decoded", decoded);
      const { id } = decoded;
      const user = await findDocument(id, "employees");
      if (user && user.active) {
        const secret = jwtSettings.SECRET;

        const payload = {
          message: "payload",
        };

        const token = jwt.sign(payload, secret, {
          expiresIn: 86400, //24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
          audience: jwtSettings.AUDIENCE,
          issuer: jwtSettings.ISSUER,
          subject: id, // Thường dùng để kiểm tra JWT lần sau
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

// CHECK ROLES ------------- //
const allowRoles = (...roles) => {
  // return a middleware
  return (request, response, next) => {
    // GET BEARER TOKEN FROM HEADER
    const bearerToken = request.get("Authorization").replace("Bearer ", "");

    // DECODE TOKEN
    const payload = jwt.decode(bearerToken, { json: true });

    // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
    const { sub } = payload;

    // FING BY _id
    findDocument(sub, "employees")
      .then((user) => {
        if (user && user.roles) {
          let ok = false;
          user.roles.forEach((role) => {
            if (roles.includes(role)) {
              ok = true;
              return;
            }
          });
          if (ok) {
            next();
          } else {
            response.status(403).json({ message: "Forbidden" }); // user is forbidden
          }
        } else {
          response.status(403).json({ message: "Forbidden" }); // user is forbidden
        }
      })
      .catch(() => {
        response.sendStatus(500);
      });
  };
};
// CALL API JWT AUTHENTICATION & CHECK ROLES
router.get(
  "/roles",
  passport.authenticate("jwt", { session: false }),
  allowRoles("managers"),
  function (req, res, next) {
    res.json({ ok: true });
  }
);

//============================END MONGOOSE============================//

//============================BEGIN MONGODB============================//
/**
 * import query mongodb
 * const { ...methods } = require('../helpers/MongoDbHelper');
 */

//QUETIONS 4-----------------------------

//============================END MONGODB============================//

module.exports = router;
