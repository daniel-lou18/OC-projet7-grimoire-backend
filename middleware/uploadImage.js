const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const { sendAppError } = require("../utils/sendError");

const storage = multer.memoryStorage();
const initMulter = multer({ storage }).single("image");

const MIME_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
];

async function uploadImage(req, _, next) {
  if (!req.file) return next();
  const { buffer, originalname, mimetype } = req.file;

  if (MIME_TYPES.indexOf(mimetype) === -1)
    return sendAppError(
      "Le format de votre fichier n'est pas pris en charge. L'image doit être au format JPEG, JPG, PNG, GIF, BMP ou WEBP",
      400,
      next
    );

  console.log(req.file);
  const filename = `${path
    .parse(originalname)
    .name.split(" ")
    .join("_")}_${Date.now()}.webp`;

  await sharp(buffer)
    .webp({ quality: 20 })
    .toFile("./images/" + filename);

  req.file.filename = filename;
  next();
}

module.exports = { initMulter, uploadImage };
