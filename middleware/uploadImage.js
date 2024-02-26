const multer = require("multer");
const sharp = require("sharp");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

async function uploadImage(req, res, next) {
  if (!req.file) return next();
  const { buffer, originalname } = req.file;
  const filename =
    originalname.split(" ").join("_") + Date.now() + "." + "webp";

  await sharp(buffer)
    .webp({ quality: 20 })
    .toFile("./images/" + filename);

  req.file.filename = filename;
  next();
}

module.exports = { upload, uploadImage };
