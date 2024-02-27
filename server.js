const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const PORT = process.env.PORT || 4000;

process.on("uncaughtException", (err) =>
  gracefulShutdown("uncaughtException", err)
);

mongoose
  .connect(process.env.DB_NAME.replace("<password>", process.env.DB_PASSWORD))
  .then(() => console.log("Connexion à MongoDB réussie !"));

const server = app.listen(PORT, () =>
  console.log(`Server is listening on port ${PORT}`)
);

// console.log(x);

function gracefulShutdown(signalOrEvent, err) {
  err
    ? console.error(`${signalOrEvent}: ${err}`)
    : console.error(" " + signalOrEvent);

  if (signalOrEvent === "uncaughtException") {
    console.log("Le serveur a été arrêté");
    return process.exit(1);
  }

  console.log("Arrêt du serveur en cours...");
  server.close(() => {
    console.log("Le serveur a été arrêté gracieusement");
    process.exit(1);
  });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGINT"));
process.on("unhandledRejection", (err) =>
  gracefulShutdown("unhandledRejection", err)
);
