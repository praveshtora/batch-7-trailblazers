import Joi from '@hapi/joi';
import Board from '../models/boardModel';
import Dashboard from '../models/dashboardModel';
import { buildResponse } from '../utils/helpers';
import constants from '../config/constants';

function validateBoard(request) {
  const validationSchema = Joi.object().keys({
    name: Joi.string().required(),
    lifecycles: Joi.array()
      .items(Joi.string().required())
      .required(),
  });
  const { error } = Joi.validate(request, validationSchema);
  return error;
}

async function addBoardToDashboard(userId, boardId) {
  try {
    const dashboard = await Dashboard.findOneAndUpdate({ userId }, { $push: { boards: boardId } });
    if (dashboard) {
      return true;
    }
  } catch (exception) {
    console.log(exception);
  }
  return false;
}
const addBoard = async (req, res) => {
  try {
    const error = validateBoard(req.body);

    if (error) {
      const [{ message }] = error.details;
      const response = buildResponse(false, message);
      return res.status(400).send(response);
    }
    const userId = req.params.id;
    const owner = userId;
    const newBoard = {
      ...req.body,
      owner,
      members: [{ userId, role: constants.ROLE_ENUM.SUPER_ADMIN }],
    };
    const boardModel = new Board(newBoard);
    console.log(boardModel);
    const resBoard = await boardModel.save();
    console.log('some');
    await addBoardToDashboard(userId, resBoard._id);
    return res.status(200).send(buildResponse(true, 'successfully added Board'));
  } catch (exception) {
    res.status(500).send(buildResponse(false, `Error occured, ${exception}`));
  }
};

module.exports = { addBoard };
