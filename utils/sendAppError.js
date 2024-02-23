const AppError = require("./appError");

exports.sendAppError = (message, statusCode, next) => {
  const err = new AppError(message, statusCode);
  next({ ...err, message: err.message });
};
