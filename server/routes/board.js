import express from 'express';
import board from '../controllers/boardController';

const router = express.Router();
router.get('/:id', board.getBoardDetails);

module.exports = router;
