import Issue from '../models/issueModel';
import { buildResponse, joiValidate } from '../utils/helpers';
import { ISSUE_CHANGE_LIFECYCLE_SCHEMA } from '../utils/constants';

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
  changeLifeCycle,
};
