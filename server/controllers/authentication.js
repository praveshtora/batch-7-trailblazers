import Joi from '@hapi/joi';
import User from '../models/userModel';
import Dashboard from '../models/dashboardModel';
import { buildResponse } from '../utils/helpers';

const validateBody = (body) => {
  const schema = Joi.object().keys({
    name: Joi.string(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
  });
  const { error } = Joi.validate(body, schema);
  return error || null;
};

exports.signUp = async (req, res, next) => {
  const error = validateBody(req.body);
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

    const newDahsboard = new Dashboard({
      userId: newlyAddedUser._id,
    });
    await newDahsboard.save();
    const response = buildResponse(true, []);
    return res.status(200).send(response);
  } catch (err) {
    return next(err);
  }
};
