import { buildResponse } from '../utils/helpers';

export default (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.user = { id: '5cf9425d064475090357aa87', name: 'Batman' };
    return next();
  }
  if (req.isAuthenticated()) return next();

  const errorMessage = 'User is not authenticated!';
  const response = buildResponse(false, errorMessage);
  return res.status(403).send(response);
};
