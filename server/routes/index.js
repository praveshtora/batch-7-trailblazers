import express from 'express';
import passport from 'passport';
import authentication from '../controllers/authentication';

import { joiValidate } from '../utils/helpers';
import { LOGIN_FIELDS_SCHEMA } from '../utils/constants';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send('Express server up');
});

router.post('/signup', authentication.signUp);
router.post(
  '/login',
  (req, res, next) => {
    const [isValid, response] = joiValidate(req.body, LOGIN_FIELDS_SCHEMA);
    if (!isValid) res.status(400).send(response);
    next();
  },
  passport.authenticate('local'),
  authentication.login,
);

module.exports = router;
