import User from '../models/userModel';
import Dashboard from '../models/dashboardModel';
import { buildResponse, joiValidate } from '../utils/helpers';
import { SIGNUP_FIELDS_SCHEMA } from '../utils/constants';

const signUp = async (req, res, next) => {
  const error = joiValidate(req.body, SIGNUP_FIELDS_SCHEMA);
  if (error) {
    const [{ message }] = error.details;
    const response = buildResponse(false, message);
    return res.status(400).send(response);
  }
  const { email, name, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const errorMessage = `Email '${email}' already in use`;
      const response = buildResponse(false, errorMessage);
      return res.status(400).send(response);
    }
    const user = new User({ name, email, password });
    const newlyAddedUser = await user.save();

    const newDashboard = new Dashboard({
      userId: newlyAddedUser._id,
    });
    await newDashboard.save();
    const response = buildResponse(true, 'Signup successfully!');

    return res.status(200).send(response);
  } catch (err) {
    return next(err);
  }
};

const login = (req, res, next) => {
  req.login(req.user, (err) => {
    if (err) return next(err);
    const response = buildResponse(true, 'Login successfully!');
    return res.status(200).send(response);
    // return res.redirect('http://localhost:3000/dashboard');
  });
};

module.exports = {
  signUp,
  login,
};
