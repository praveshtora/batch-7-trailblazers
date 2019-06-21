import Joi from '@hapi/joi';

const JoiObject = schema => Joi.object().keys(schema);

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

const getIssueDetails = {
  id: Joi.number().required(),
};

const inviteEmail = {
  email: Joi.string()
    .email()
    .required(),
};

const comment = {
  description: Joi.string().required(),
  createdBy: Joi.string().required(),
  createdAt: Joi.date(),
};

const updateIssueDetails = {
  id: Joi.number().required(),
  title: Joi.string(),
  dueDate: Joi.date(),
  assignee: Joi.string().empty(''),
  description: Joi.string(),
  newComments: Joi.array().items(JoiObject(comment)),
};

export const SERVER_ERROR_MESSAGE = 'Some error occurred on server';
export const SERVER_NOT_AUTHENTICATE = "You don't have permission to view data";
export const LOGIN_FIELDS_SCHEMA = JoiObject(loginFields);
export const SIGNUP_FIELDS_SCHEMA = JoiObject(signupFields);
export const ISSUE_CHANGE_LIFECYCLE_SCHEMA = JoiObject(changeLifeCycle);
export const GET_MEMBERS = JoiObject(getMembers);
export const UPDATE_MEMBER_ROLE = JoiObject(updateMemberRole);
export const DELETE_MEMBER = JoiObject(deleteMember);
export const ADD_BOARD = JoiObject(addBoard);
export const GET_ISSUE_DETAILS = JoiObject(getIssueDetails);
export const INVITE_EMAIL_SCHEMA = JoiObject(inviteEmail);
export const UPDATE_ISSUE_DETAILS = JoiObject(updateIssueDetails);
