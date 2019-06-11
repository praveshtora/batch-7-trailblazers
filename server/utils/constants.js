import Joi from '@hapi/joi';

const loginFields = {
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required(),
};

const signupFields = {
  name: Joi.string(),
  ...loginFields,
};

export const LOGIN_FIELDS_SCHEMA = Joi.object().keys(loginFields);
export const SIGNUP_FIELDS_SCHEMA = Joi.object().keys(signupFields);
