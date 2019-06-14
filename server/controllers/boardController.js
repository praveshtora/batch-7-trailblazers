import Board from '../models/boardModel';
import { buildResponse } from '../utils/helpers';
import {} from '../models/issueModel';

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
    return res.status(500).send(buildResponse(false, 'Something went wrong'));
  }
};

module.exports = { getBoardDetails };
