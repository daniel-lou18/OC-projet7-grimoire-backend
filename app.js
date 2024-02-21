const express = require("express");
const mongoose = require("mongoose");
const bookRouter = require("./routes/bookRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

mongoose
  .connect(
    "mongodb+srv://daniel:jjOAkIkCSoZb5qpd@cluster0.hyexph1.mongodb.net/grimoire?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

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

app.use("/api/books", bookRouter);
app.use("/api/auth", authRouter);

module.exports = app;
