const AppError = require("./appError");

exports.sendAppError = (message, statusCode, next) => {
  const err = new AppError(message, statusCode);
  console.log("my message", err.message);
  next({ ...err, message: err.message });
};

exports.sendError = (err, statusCode, next) => {
  if (!err.statusCode) err.statusCode = statusCode;
  next(err);
};
