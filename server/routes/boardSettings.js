import express from 'express';
import boardSettings from '../controllers/boardSettingsController';

const router = express.Router();

router.get('/members/:id', boardSettings.getMembers);
router.patch('/member/:id', boardSettings.updateMemberRole);
router.delete('/member/:id', boardSettings.deleteMember);
module.exports = router;
