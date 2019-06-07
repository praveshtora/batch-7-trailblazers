import Board from '../models/boardModel';
import { buildResponse } from '../utils/helpers';
import {} from '../models/issuesModel';

const getBoardDetails = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (typeof id !== 'number') {
    res.status(400).send(buildResponse(false, `${req.params.id} should be a number`));
  }
  try {
    let [board] = await Board.find({ id });
    if (!board) {
      res.status(400).send(buildResponse(false, `No board found with id :${id}`));
    }
    board = await Board.populate(board, { path: 'issues' });
    if (board) {
      const { lifecycles, issues } = board;
      const responseObject = lifecycles.reduce(
        (acc, lc) => Object.assign(acc, { [lc]: { issues: [] } }),
        {},
      );
      issues.forEach((issue) => {
        const { lifeCycle } = issue;
        responseObject[lifeCycle].issues.push(issue);
      });
      res.status(200).send(buildResponse(true, '', { lifeCycles: responseObject }));
    }
  } catch (err) {
    res.status(500).send(buildResponse(false, `Error , ${err}`));
  }
};

module.exports = { getBoardDetails };
