import express from 'express';
import board from '../controllers/boardController';
import boardSettings from '../controllers/boardSettingsController';
import authenticateRoute from '../middlewares/authenticateRoute';

const router = express.Router();
router.get('/:id', authenticateRoute, board.getBoardDetails);
router.post('/issue/add/:id', authenticateRoute, board.addIssue);

router.get('/members/:id', authenticateRoute, boardSettings.getMembers);
router.patch('/member/:id', authenticateRoute, boardSettings.updateMemberRole);
router.delete('/member/:id', authenticateRoute, boardSettings.deleteMember);
router.get('/member/role/:id', authenticateRoute, boardSettings.getRoleOfMember);
router.post('/:id/invite', authenticateRoute, board.inviteUser);

module.exports = router;
