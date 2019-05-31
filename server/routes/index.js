import express from 'express';
import authentication from '../controllers/authentication';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send('Express server up');
});

router.post('/signup', authentication.signUp);

module.exports = router;
