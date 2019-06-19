import passport from 'passport';
import { Strategy } from 'passport-local';
import User from '../models/userModel';

/*
 * @return done(error, user, info?)
 */
const handleUserValidation = async (email, password, done) => {
  const user = await User.findOne({ email });

  if (!user) {
    return done(null, false, { message: 'Email Not Found' });
  }
  if (!user.validatePassword(password)) {
    return done(null, false, { message: 'Incorrect password.' });
  }

  return done(null, user);
};

passport.use(
  new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    handleUserValidation,
  ),
);

passport.serializeUser((user, callback) => callback(null, user.id));

passport.deserializeUser((id, callback) => {
  User.findById(id, (err, user) => {
    if (err) return callback(err);
    return callback(null, user);
  });
});
