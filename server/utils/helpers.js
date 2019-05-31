const buildResponse = (isSuccess, message, data = {}) => {
  if (isSuccess) {
    return { isSuccess, message, data };
  }
  return { isSuccess, message };
};
module.exports = { buildResponse };
