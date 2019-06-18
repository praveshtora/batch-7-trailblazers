import Joi from '@hapi/joi';

const changeLifeCycle = {
  id: Joi.number().required(),
  lifeCycle: Joi.string().required(),
};

const getMembers = {
  id: Joi.number().required(),
};

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

const updateMemberRole = {
  id: Joi.number().required(),
  member: Joi.string().required(),
  role: Joi.string().required(),
};

const deleteMember = {
  id: Joi.number().required(),
  member: Joi.string().required(),
};

export const ROLES_ENUM = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
};

const addBoard = {
  name: Joi.string().required(),
  lifeCycles: Joi.array()
    .items(Joi.string().required())
    .unique()
    .required(),
};

const inviteEmail = {
  email: Joi.string()
    .email()
    .required(),
};
const JoiObject = schema => Joi.object().keys(schema);

export const SERVER_ERROR_MESSAGE = 'Some error occurred on server';
export const LOGIN_FIELDS_SCHEMA = JoiObject(loginFields);
export const SIGNUP_FIELDS_SCHEMA = JoiObject(signupFields);
export const ISSUE_CHANGE_LIFECYCLE_SCHEMA = JoiObject(changeLifeCycle);
export const GET_MEMBERS = JoiObject(getMembers);
export const UPDATE_MEMBER_ROLE = JoiObject(updateMemberRole);
export const DELETE_MEMBER = JoiObject(deleteMember);
export const ADD_BOARD = JoiObject(addBoard);
export const INVITE_EMAIL_SCHEMA = JoiObject(inviteEmail);
