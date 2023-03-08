const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
// MULTER UPLOAD
const multer = require("multer");
const { updateDocument, findDocument } = require("../helpers/MongoDbHelper");

const UPLOAD_DIRECTORY = "./public/uploads/img";

var upload = multer({
  storage: multer.diskStorage({
    contentType: multer.AUTO_CONTENT_TYPE,
    destination: function (req, file, callback) {
      const { id, collectionName } = req.params;

      const PATH = `${UPLOAD_DIRECTORY}/${collectionName}/${id}`;
      // console.log('PATH', PATH);
      if (!fs.existsSync(PATH)) {
        // Create a directory
        fs.mkdirSync(PATH, { recursive: true });
      }
      callback(null, PATH);
    },
    filename: function (req, file, callback) {
      // Xử lý tên file cho chuẩn
      const fileInfo = path.parse(file.originalname);
      const safeFileName =
        fileInfo.name.replace(/[^a-z0-9]/gi, "_").toLowerCase() + fileInfo.ext;
      // return
      callback(null, safeFileName);
    },
  }),
}).single("file");

//http://localhost:9000/upload/products/63654be2cda9a0009835fdb5
//sửa lại bất kì products thành collection nào
router.post("/:collectionName/:id", function (req, res, next) {
  //if (req.body.file !== undefined) {
  // Kiểm tra xem values gửi về có kèm file ảnh hay không
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ type: "MulterError", err: err });
    } else if (err) {
      res.status(500).json({ type: "UnknownError", err: err });
    } else {
      const { collectionName, id } = req.params;

      console.log("req.body", req.body);

      // UPDATE MONGODB
      if (collectionName === "categories") {
        await updateDocument(
          id,
          {
            imageURL: `/uploads/img/${collectionName}/${id}/${req.file.filename}`,
          },
          collectionName
        );
      }
      if (collectionName === "products") {
        await updateDocument(
          id,
          {
            imageProduct: `/uploads/img/${collectionName}/${id}/${req.file.filename}`,
          },
          collectionName
        );
      }
      if (collectionName === "customers") {
        await updateDocument(
          id,
          {
            avatar: `/uploads/img/${collectionName}/${id}/${req.file.filename}`,
          },
          collectionName
        );
      }
      if (collectionName === "employees") {
        await updateDocument(
          id,
          {
            avatar: `/uploads/img/${collectionName}/${id}/${req.file.filename}`,
          },
          collectionName
        );
      }
      //
      // console.log('host', req.get('host'));
      const publicUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/img/${collectionName}/${id}/${req.file.filename}`;
      res.status(200).json({ ok: true, publicUrl: publicUrl });
    }
  });
  //}
});

// upload mootj array anh
router.post("/:collectionName/:id/images", function (req, res, next) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ type: "MulterError", err: err });
    } else if (err) {
      res.status(500).json({ type: "UnknownError", err: err });
    } else {
      const { collectionName, id } = req.params;

      console.log("req.body", req.body);

      // UPDATE MONGODB
      const newImageUrl = `/uploads/${collectionName}/${id}/${req.file.filename}`;
      const found = await findDocument(id, collectionName);
      let images = found.images;
      if (!images) {
        images = [];
      }
      images.push(newImageUrl);

      await updateDocument(id, { images: images }, collectionName);

      // console.log('host', req.get('host'));
      const publicUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/img/${collectionName}/${id}/${req.file.filename}`;
      res.status(200).json({ ok: true, publicUrl: publicUrl });
    }
  });
});

module.exports = router;
