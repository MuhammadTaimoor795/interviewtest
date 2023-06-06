const success = (results, statusCode) => {
  return {
    data: results,
    success: true,
    code: statusCode,
  };
};

const errorResponse = (message, statusCode) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 404, 403, 409, 422, 500];

  // Get matched code
  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    error: message.replace(/[^=' :.,a-zA-Z0-9]/g, ""),
    code: statusCode,
    success: false,
  };
};

const validation = (error) => {
  return {
    error: error.replace(/[^=' :.,a-zA-Z0-9]/g, ""),
    success: false,
    code: 422,
  };
};

module.exports = {
  validation,
  errorResponse,
  success,
};
