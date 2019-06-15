import express from 'express';
import board from '../controllers/boardController';
import boardSettings from '../controllers/boardSettingsController';

const router = express.Router();
router.get('/:id', board.getBoardDetails);
router.post('/issue/add/:id', board.addIssue);

router.get('/members/:id', boardSettings.getMembers);
router.patch('/member/:id', boardSettings.updateMemberRole);
router.delete('/member/:id', boardSettings.deleteMember);

module.exports = router;
