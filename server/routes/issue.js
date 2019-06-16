import express from 'express';
import Issue from '../controllers/issueController';
import authenticateRoute from '../middlewares/authenticateRoute';

const router = express.Router();

router.post('/changeLifeCycle', authenticateRoute, Issue.changeLifeCycle);

module.exports = router;
