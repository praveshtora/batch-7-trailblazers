import Issue from '../models/issueModel';
import {} from '../models/commentModel';
import { buildResponse, joiValidate } from '../utils/helpers';
import {
  ISSUE_CHANGE_LIFECYCLE_SCHEMA,
  GET_ISSUE_DETAILS,
  SERVER_ERROR_MESSAGE,
} from '../utils/constants';

const getIssueDetails = async (req, res) => {
  const [isValid, response] = joiValidate(req.params, GET_ISSUE_DETAILS);
  if (!isValid) return res.status(400).send(response);

  try {
    const { id } = req.params;

    const issue = await Issue.findOne({ id }).populate('comments');
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
    return res.status(500).send(buildResponse(false, 'Something went wrong'));
  }
};

module.exports = {
  getIssueDetails,
  changeLifeCycle,
};
