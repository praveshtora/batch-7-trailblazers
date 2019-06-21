import Joi from '@hapi/joi';
import Board from './../models/boardModel';

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

export const validateUserInBoard = async (userId, boardId) => {
  if(userId && boardId) {
    try {
      const board = await Board.findOne({ id: boardId, 'members.user': userId }).select('name');
      if(board) {
        return true;
      }
    } catch(error) {
      console.log(error);
    }
  }

  return false;
}
