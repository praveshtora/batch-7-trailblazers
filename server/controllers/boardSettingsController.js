import Board from '../models/boardModel';
import Issue from '../models/issueModel';
import { buildResponse, joiValidate, validateUserInBoard } from '../utils/helpers';
import {
  ROLES_ENUM,
  SERVER_ERROR_MESSAGE,
  GET_MEMBERS,
  UPDATE_MEMBER_ROLE,
  DELETE_MEMBER,
} from '../utils/constants';
import mongoose from 'mongoose';
import { SERVER_NOT_AUTHENTICATE } from './../utils/constants';

const getMembers = async (req, res) => {
  try {
    const userId = req.user.id;
    const [isValid, response] = joiValidate(req.params, GET_MEMBERS);
    if (!isValid) return res.status(400).send(response);

    const boardId = req.params.id;
    const isUserPresent = await validateUserInBoard(userId, boardId);
    if(!isUserPresent) {
      return res.status(401).send(buildResponse(false, SERVER_NOT_AUTHENTICATE));
    }
    const board = await Board.findOne({ id: boardId }, { members: 1 }).populate(
      'members.user',
      'name email',
    );
    if (!board) {
      return res.status(400).send(buildResponse(false, 'Member does not exist'));
    }

    return res.send(buildResponse(true, '', board.members));
  } catch (exception) {
    console.log(exception);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const [isValid, response] = joiValidate(
      { ...req.body, id: req.params.id },
      UPDATE_MEMBER_ROLE,
    );
    if (!isValid) return res.status(400).send(response);

    const boardId = req.params.id;
    const newRole = req.body.role;
    const { member } = req.body;
    if (!ROLES_ENUM[newRole]) {
      res.status(406).send(buildResponse(false, 'Role does not exist'));
    }
    await Board.findOneAndUpdate(
      { id: boardId, 'members.user': member },
      { $set: { 'members.$.role': newRole } },
    );
    return res.send(buildResponse(true, 'Member role updated successfully'));
  } catch (exception) {
    console.log(exception);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

const deleteMember = async (req, res) => {
  try {
    const [isValid, response] = joiValidate({ ...req.body, id: req.params.id }, DELETE_MEMBER);
    if (!isValid) return res.status(400).send(response);

    const boardId = req.params.id;
    const { member } = req.body;

    const board = await Board.findOne({
      id: boardId,
      'members.user': member,
    }).select('issues');
    if (!board) {
      return res.status(400).send(buildResponse(false, 'Member does not present in board'));
    }

    await Board.findOneAndUpdate(
      { id: boardId, 'members.user': member },
      { $pull: { members: { user: member } } },
    );

    // set all issues assginee related with member should be not assigned
    if (board.issues.length > 0) {
      await Issue.updateMany(
        { _id: { $in: board.issues }, asignee: member },
        { $set: { asignee: '' } }
      );
    }

    return res.send(buildResponse(true, 'Member deleted successfully'));
  } catch (exception) {
    console.log(exception);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

const getRoleOfMember = async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.id;
    const isUserPresent = await validateUserInBoard(userId, boardId);
    if(!isUserPresent) {
      return res.status(401).send(buildResponse(false, SERVER_NOT_AUTHENTICATE));
    }
    const board = await Board.findOne({ id: boardId }, { members: 1 });

    const member = board.members.filter(mem => {
      return mem.user.toString() === userId;
    });

    if (!member) {
      return res.status(400).send(buildResponse(false, 'Member does not present in board'));
    }
    return res.send(buildResponse(true, '', member));
  } catch (exception) {
    console.log(exception);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
} 

export default {
  getMembers,
  updateMemberRole,
  deleteMember,
  getRoleOfMember
};
