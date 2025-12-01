import { formatResponse } from '../utils/helpers.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json(formatResponse(false, null, message, {
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  }));
};

export const notFound = (req, res) => {
  res.status(404).json(formatResponse(false, null, 'Route not found'));
};
