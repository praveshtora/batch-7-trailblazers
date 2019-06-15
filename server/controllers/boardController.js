import Joi from '@hapi/joi';
import Board from '../models/boardModel';
import { buildResponse } from '../utils/helpers';
import Issue from '../models/issueModel';
import { SERVER_ERROR_MESSAGE } from '../utils/constants';

const getBoardDetails = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    console.log(`${req.params.id} is not a number`);
    return res.status(400).send(buildResponse(false, 'Invalid request to get board details!'));
  }
  try {
    const [board] = await Board.find({ id }, 'lifeCycles issues').populate('issues', 'title  lifeCycle comments id');
    if (!board) {
      console.log(` No board found with Id :${id}`);
      return res.status(400).send(buildResponse(false, 'Oops! Board not found'));
    }
    const { lifeCycles, issues } = board;
    const responseObject = lifeCycles.reduce(
      (acc, lc) => Object.assign(acc, { [lc]: { issues: [] } }),
      {},
    );
    issues.forEach((issue) => {
      const issueTobeSent = {
        ...issue._doc,
        comments: issue.comments.length,
      };
      const { lifeCycle } = issue;
      responseObject[lifeCycle].issues.push(issueTobeSent);
    });
    return res.status(200).send(buildResponse(true, '', { lifeCycles: responseObject }));
  } catch (err) {
    console.error(err);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};


const addIssue = async function (req, res) {
  try {
    const validationSchema = Joi.object().keys({
      id: Joi.number().required(),
      title: Joi.string().required(),
      description: Joi.string(),
      assignee: Joi.string().empty(''),
      dueDate: Joi.date().empty(''),
    });
    const { error } = Joi.validate({ ...req.body, id: req.params.id }, validationSchema);
    if (error) {
      const [{ message }] = error.details;
      const response = buildResponse(false, message);
      return res.status(400).send(response);
    }
    const boardId = req.params.id;

    const board = await Board.findOne({ id: boardId }).select('lifecycles');
    if (!board) {
      return res.send(buildResponse(false, 'Board does not exist'));
    }
    const newIssue = {
      ...req.body,
      lifeCycle: board.lifecycles[0],
    };

    const issueModel = new Issue(newIssue);
    const issueResult = await issueModel.save();

    const boardResult = await Board.findOneAndUpdate(
      { id: boardId },
      { $push: { issues: issueResult._id } },
    );
    if (!boardResult) {
      return res.send(buildResponse(false, 'Failed to add issue to board'));
    }
    return res.send(buildResponse(true, 'Issue added to board successfully'));
  } catch (exception) {
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

module.exports = { getBoardDetails, addIssue };
