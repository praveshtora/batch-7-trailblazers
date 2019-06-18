import express from 'express';
import board from '../controllers/boardController';
import boardSettings from '../controllers/boardSettingsController';
import authenticateRoute from '../middlewares/authenticateRoute';

const router = express.Router();
router.get('/:id', board.getBoardDetails);
router.post('/issue/add/:id', board.addIssue);

router.get('/members/:id', boardSettings.getMembers);
router.patch('/member/:id', boardSettings.updateMemberRole);
router.delete('/member/:id', boardSettings.deleteMember);
router.get('/member/role/:id', boardSettings.getRoleOfMember);
router.post('/:id/invite', authenticateRoute, board.inviteUser);

module.exports = router;
