import Joi from '@hapi/joi';
import Board from '../models/boardModel';
import { buildResponse, joiValidate } from '../utils/helpers';
import Issue from '../models/issueModel';
import { INVITE_EMAIL_SCHEMA, SERVER_ERROR_MESSAGE, ROLES_ENUM } from '../utils/constants';
import User from '../models/userModel';

import sendEmail from '../utils/emailService';

const validateBoardId = (idFromReq) => {
  const id = parseInt(idFromReq, 10);
  if (Number.isNaN(id)) {
    console.log(`${idFromReq} is not a number`);
    return false;
  }
  return true;
};

const invitedUserAlreadyMember = (board, invitedUser) => {
  const { members } = board;
  return members.some(member => member.user.id === invitedUser.id);
};

const getBoardDetails = async (req, res) => {
  const boardId = req.params.id;
  const isBordIdValid = validateBoardId(boardId);
  if (!isBordIdValid) {
    return res.status(400).send(buildResponse(false, 'Invalid request to get board details!'));
  }
  try {
    const id = parseInt(req.params.id, 10);
    const [board] = await Board.find({ id }, 'lifeCycles issues').populate(
      'issues',
      'title  lifeCycle comments id',
    );
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

    const board = await Board.findOne({ id: boardId }).select('lifeCycles');
    if (!board) {
      return res.send(buildResponse(false, 'Board does not exist'));
    }
    const newIssue = {
      ...req.body,
      lifeCycle: board.lifeCycles[0],
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

const inviteUser = async (req, res) => {
  const boardId = req.params.id;
  const isBordIdValid = validateBoardId(boardId);
  if (!isBordIdValid) {
    return res.status(400).send(buildResponse(false, 'Invalid request to get board details!'));
  }
  const [isValid, response] = joiValidate(req.body, INVITE_EMAIL_SCHEMA);
  if (!isValid) return res.status(400).send(response);
  const { email } = req.body;
  const { name: userName } = req.user;
  try {
    const board = await Board.findOne({ id: boardId }, 'members').populate(
      'members.user',
      'name email',
    );
    if (!board) {
      console.log(` No board found with Id :${boardId}`);
      return res.status(400).send(buildResponse(false, 'Oops! Board not found'));
    }
    const invitedUserinDB = await User.findOne({ email });
    if (invitedUserinDB) {
      if (invitedUserAlreadyMember(board, invitedUserinDB)) {
        return res.status(400).send(buildResponse(false, 'Already a member of this Board'));
      }
      const boardUpdatedPromise = Board.findOneAndUpdate(
        { id: boardId },
        { $push: { members: { user: invitedUserinDB.id, role: ROLES_ENUM.USER } } },
      );
      const boardUpdated = await boardUpdatedPromise;
      const subject = `Invitaion to collaborate on Board ${boardUpdated.name}`;
      const body = `Hi ${invitedUserinDB.name},
      You are invited by ${userName} to collaborate on ${boardUpdated.name}
    Thanks`;
      await sendEmail(email, 'Pravesh', subject, body);
      return res.status(200).send(buildResponse(true, 'Invitation sent'));
    }
    return res.status(400).send(buildResponse(false, 'User is not registered with us.'));
  } catch (err) {
    console.log(err);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

module.exports = { getBoardDetails, inviteUser, addIssue };
