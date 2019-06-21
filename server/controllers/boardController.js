import Joi from '@hapi/joi';
import fs from 'fs';
import handelbars from 'handlebars';
import Board from '../models/boardModel';
import { buildResponse, joiValidate, validateUserInBoard } from '../utils/helpers';
import Issue from '../models/issueModel';
import {
  INVITE_EMAIL_SCHEMA,
  SERVER_ERROR_MESSAGE,
  SERVER_NOT_AUTHENTICATE,
  ROLES_ENUM,
} from '../utils/constants';
import User from '../models/userModel';
import Dashboard from '../models/dashboardModel';
import sendEmail from '../utils/emailService';

const readHTMLFile = path => fs.readFileSync(path);

const sendInviteEmail = async (name, email, boardName, sender) => {
  const html = readHTMLFile(`${__dirname}/invitationEmail.html`);
  const htmlTemplate = handelbars.compile(html.toString());
  const replacements = {
    Product: 'Groot',
    name,
    board: boardName,
    sender,
  };
  const htmlTosend = htmlTemplate(replacements);
  await sendEmail(email, 'Groot', `Invitation to Collaborate on ${boardName}`, '', htmlTosend);
};

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
  const userId = req.user.id;
  const boardId = req.params.id;
  const isBordIdValid = validateBoardId(boardId);
  if (!isBordIdValid) {
    return res.status(400).send(buildResponse(false, 'Invalid request to get board details!'));
  }
  try {
    const id = parseInt(req.params.id, 10);

    const isUserPresent = await validateUserInBoard(userId, boardId);
    if (!isUserPresent) {
      return res.status(401).send(buildResponse(false, SERVER_NOT_AUTHENTICATE));
    }

    const [board] = await Board.find({ id }, 'lifeCycles issues name').populate(
      'issues',
      'title lifeCycle comments id created_at dueDate',
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
      const issueData = {
        ...issue._doc,
        comments: issue.comments.length,
      };
      const { lifeCycle } = issue;
      responseObject[lifeCycle].issues.push(issueData);
    });
    return res
      .status(200)
      .send(buildResponse(true, '', { lifeCycles: responseObject, name: board.name }));
  } catch (err) {
    console.error(err);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

const addIssue = async function (req, res) {
  try {
    const userId = req.user.id;
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
      createdBy: userId,
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
    const invitedUserInDB = await User.findOne({ email });
    if (invitedUserInDB) {
      if (invitedUserAlreadyMember(board, invitedUserInDB)) {
        return res.status(400).send(buildResponse(false, 'Already a member of this Board'));
      }
      const boardUpdatedPromise = Board.findOneAndUpdate(
        { id: boardId },
        { $push: { members: { user: invitedUserInDB.id, role: ROLES_ENUM.USER } } },
      );
      const inviteUserId = invitedUserInDB._id;
      await Dashboard.findOneAndUpdate({ userId: inviteUserId }, { $push: { boards: board._id } });
      const boardUpdated = await boardUpdatedPromise;
      await sendInviteEmail(invitedUserInDB.name, email, boardUpdated.name, userName);
      return res.status(200).send(buildResponse(true, 'Invitation sent'));
    }
    return res.status(400).send(buildResponse(false, 'User is not registered with us.'));
  } catch (err) {
    console.log(err);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

module.exports = { getBoardDetails, inviteUser, addIssue };
