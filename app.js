const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bookRouter = require("./routes/bookRoutes");
const authRouter = require("./routes/authRoutes");
const AppError = require("./utils/appError");

const app = express();
dotenv.config();

mongoose
  .connect(process.env.DB_NAME.replace("<password>", process.env.DB_PASSWORD), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

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
  res.status(err.statusCode || 500).json(err);
});

module.exports = app;
