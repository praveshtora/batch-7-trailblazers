import Joi from '@hapi/joi';

export const buildResponse = (isSuccess, message = '', data = {}) => {
  if (isSuccess) {
    return { isSuccess, message, data };
  }
  return { isSuccess, message };
};

export const joiValidate = (body, schema) => {
  const { error } = Joi.validate(body, schema);
  return error || null;
};
