import Issue from '../models/issueModel';
import Comment from '../models/commentModel';
import { buildResponse, joiValidate } from '../utils/helpers';
import {
  ISSUE_CHANGE_LIFECYCLE_SCHEMA,
  GET_ISSUE_DETAILS,
  SERVER_ERROR_MESSAGE,
  UPDATE_ISSUE_DETAILS,
} from '../utils/constants';

const getIssueDetails = async (req, res) => {
  const [isValid, response] = joiValidate(req.params, GET_ISSUE_DETAILS);
  if (!isValid) return res.status(400).send(response);

  try {
    const { id } = req.params;

    const issue = await Issue.findOne({ id })
    .populate('comments')
    .populate('createdBy', 'name');
    if (!issue) {
      return res.send(buildResponse(false, "Issue doesn't exist"));
    }
    const data = issue._doc;
    // Not to expose _id of any data
    delete data._id;

    return res.send(buildResponse(true, '', data));
  } catch (err) {
    console.error(err);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

const changeLifeCycle = async (req, res) => {
  const [isValid, response] = joiValidate(req.body, ISSUE_CHANGE_LIFECYCLE_SCHEMA);
  if (!isValid) return res.status(400).send(response);
  const { id, lifeCycle } = req.body;

  try {
    const issue = await Issue.findOneAndUpdate({ id }, { $set: { lifeCycle } });
    if (!issue) throw new Error(`Can't add this Issue to ${lifeCycle}!`);

    return res.status(200).send(buildResponse(true, 'New Issue added!'));
  } catch (err) {
    console.error(err);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

const filterOutUndefined = obj => Object.entries(obj)
  .reduce((acc, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});

const update = async (req, res) => {
  console.log(req.body);
  const [isValid, response] = joiValidate(req.body, UPDATE_ISSUE_DETAILS);
  if (!isValid) return res.status(400).send(response);

  try {
    const {
      id, title, dueDate, assignee, description, newComments,
    } = req.body;

    const fields = {
      title, dueDate, assignee, description,
    };

    const fieldsToUpdate = filterOutUndefined(fields);
    const updateOperation = {
      $set: {
        ...fieldsToUpdate,
      },
    };

    if (newComments) {
      const allNewComments = await Promise.all(
        newComments.map((newComment) => {
          const comment = new Comment({
            description: newComment,
            createdBy: req.user.name,
          });
          return comment.save();
        }),
      );
      const ids = allNewComments.map(comment => comment._id);
      updateOperation.$push = { comments: { $each: ids } };
    }
    const result = await Issue.findOneAndUpdate({ id }, updateOperation);
    if (!result) {
      return res.send(buildResponse(false, 'Failed to update issue details!'));
    }
    return res.send(buildResponse(true, 'Issue details updated!'));
  } catch (err) {
    console.error(err);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

module.exports = {
  getIssueDetails,
  changeLifeCycle,
  update,
};
