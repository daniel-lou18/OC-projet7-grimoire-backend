const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bookRouter = require("./routes/bookRoutes");
const authRouter = require("./routes/authRoutes");
const AppError = require("./utils/appError");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "/images")));

app.use("/api/books", bookRouter);
app.use("/api/auth", authRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(
    `Oups! La route que vous demandez n'existe pas`,
    404
  );
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError" || err.name === "CastError")
    return res.status(400).json(err);
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
    return res.status(401).json(err);
  res.status(err.statusCode || 500).json(err);
});

module.exports = app;
