var express = require("express");
var router = express.Router();
const yup = require("yup");

const { validateSchema } = require("../schemas");
const { default: mongoose } = require("mongoose");
const { Account } = require("../models");

//MONGOOSE
// mongoose.connect("mongodb://127.0.0.1:27017/cloud-market-AH");
const { CONNECTION_STRING } = require("../constants/connectionDB");

//MONGOOSE
mongoose.connect(CONNECTION_STRING);

var passport = require("passport");
var jwt = require("jsonwebtoken");
const jwtSettings = require("../constants/jwtSettings");
const { findDocuments, findDocument } = require("../helpers/MongoDbHelper");

/* GET list data account. */
router.get("/", function (req, res, next) {
  try {
    Account.find()
      .sort({ name: 1 })
      .then((result) => {
        res.send(result);
        // console.log(result);
      });
  } catch (error) {
    // console.log(error);
    res.sendStatus(500);
  }
});

/* GET account by Id */
router.get("/:id", function (req, res, next) {
  if (
    req.params.id === "search" ||
    req.params.id === "users-find" ||
    req.params.id === "authentication" ||
    req.params.id === "roles"
  ) {
    next();
    return;
  }
  try {
    const { id } = req.params;
    Account.findById(id).then((result) => {
      // console.log(result);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/", function (req, res, next) {
  try {
    const data = req.body;
    const newItem = new Account(data);
    newItem.save().then((result) => {
      // console.log(result);
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//Update Account
router.patch("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Account.findByIdAndUpdate(id, data, {
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

//Remove Account
router.delete("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    Account.findByIdAndDelete(id).then((result) => {
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
    username: yup.string().email().required(),
    password: yup.string().required(() => {
      return "Lỗi ....";
    }),
  }),
});

router.post(
  "/login-validate",
  validateSchema(loginSchema),
  (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log("* username: ", username);
    console.log("* password: ", password);
    if (username === "admin@gmail.com" && password === "admin123") {
      res.send({ message: "Login success!" });
      return;
    }

    res.status(401).send({ message: "Login failed!" });
  }
);
// ----------------------------------------------- //

// TEST LOGIN WITH PARAMS ---------- //
const getByIdSchema = yup.object({
  params: yup.object({
    id: yup.number().required(),
  }),
});
router.get("/users/:id", validateSchema(getByIdSchema), (req, res, next) => {
  res.send("OK");
});
// ----------------------------------------------- //

// TEST LOGIN WITH QUERY STRING ---------- //
const findSchema = yup.object({
  query: yup.object({
    fullName: yup.string().required(),
    email: yup.string().email().required(),
  }),
});
router.get("/users-find", validateSchema(findSchema), (req, res, next) => {
  res.send("OK");
});
// ----------------------------------------------- //

// TEST LOGIN WITH JWT ---------- //
router.post(
  "/login-jwt",
  validateSchema(loginSchema),
  async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log("* username: ", username);
    console.log("* password: ", password);

    const found = await findDocuments(
      {
        query: {
          username: username,
          password: password,
        },
      },
      "accounts"
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
          username: username,
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
      const user = await findDocument(id, "accounts");
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
// ----------------------------------------------- //

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
    findDocument(sub, "accounts")
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

// ------------------------------------------------------------------------------------------------
// CALL API JWT AUTHENTICATION & CHECK ROLES
router.get(
  "/roles",
  passport.authenticate("jwt", { session: false }),
  allowRoles("managers"),
  function (req, res, next) {
    res.json({ ok: true });
  }
);
// ------------------------------------------------------------------------------------------------

module.exports = router;
