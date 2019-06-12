import express from 'express';
import dashboard from '../controllers/dashboardController';
import authenticateRoute from '../middlewares/authenticateRoute';

const router = express.Router();

/* GET home page. */
router.post('/add', authenticateRoute, dashboard.addBoard);
router.get('/getboards', authenticateRoute, dashboard.getBoardList);

module.exports = router;
