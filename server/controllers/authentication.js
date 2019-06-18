import User from '../models/userModel';
import Dashboard from '../models/dashboardModel';
import { buildResponse, joiValidate } from '../utils/helpers';
import { SIGNUP_FIELDS_SCHEMA, SERVER_ERROR_MESSAGE } from '../utils/constants';

const signUp = async (req, res) => {
  const [isValid, response] = joiValidate(req.body, SIGNUP_FIELDS_SCHEMA);
  if (!isValid) return res.status(400).send(response);

  const { email, name, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const errorMessage = 'This email is already in use!';
      return res.status(400).send(buildResponse(false, errorMessage));
    }
    const user = new User({ name, email, password });
    const newlyAddedUser = await user.save();

    const newDashboard = new Dashboard({
      userId: newlyAddedUser._id,
    });
    await newDashboard.save();

    return res.status(200).send(buildResponse(true, 'Signup successfully!'));
  } catch (err) {
    console.error(err);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

const login = (req, res) => {
  req.login(req.user, (err) => {
    if (err) return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
    return res.status(200).send(buildResponse(true, 'Login successfully!', {name: req.user.name, email: req.user.email}));
  });
};

module.exports = {
  signUp,
  login,
};
