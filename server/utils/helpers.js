import Joi from '@hapi/joi';

export const buildResponse = (isSuccess, message = '', data = {}) => {
  if (isSuccess) {
    return { isSuccess, message, data };
  }
  return { isSuccess, message };
};

export const joiValidate = (data, schema) => {
  const { error } = Joi.validate(data, schema);
  if (error) {
    const [{ message }] = error.details;
    const response = buildResponse(false, message);
    return [false, response];
  }
  return [true];
};
