const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const bookRouter = require("./routes/bookRoutes");
const authRouter = require("./routes/authRoutes");
const { sendAppError } = require("./utils/sendError");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "/images")));

app.use("/api/books", bookRouter);
app.use("/api/auth", authRouter);

app.all("*", (req, res, next) =>
  sendAppError(`Oups! La route que vous demandez n'existe pas`, 404, next)
);

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError" || err.name === "CastError")
    return res.status(400).json(err);
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
    return res.status(401).json(err);
  res.status(err.statusCode || 500).json(err);
});

module.exports = app;
