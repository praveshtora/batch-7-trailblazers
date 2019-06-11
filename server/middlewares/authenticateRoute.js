import { buildResponse } from '../utils/helpers';

export default (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next();
  if (req.isAuthenticated()) return next();

  const errorMessage = 'User is not authenticated!';
  const response = buildResponse(false, errorMessage);
  return res.status(403).send(response);
};
