import express from 'express';
import Issue from '../controllers/issueController';
import authenticateRoute from '../middlewares/authenticateRoute';

const router = express.Router();

router.get('/:id', authenticateRoute, Issue.getIssueDetails);
router.post('/changeLifeCycle', Issue.changeLifeCycle);

module.exports = router;
