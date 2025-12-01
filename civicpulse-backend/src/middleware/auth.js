import jwt from 'jsonwebtoken';
import { formatResponse } from '../utils/helpers.js';

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(formatResponse(false, null, 'Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'user') {
      return res.status(403).json(formatResponse(false, null, 'Invalid token type'));
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(formatResponse(false, null, 'Invalid or expired token'));
  }
};

export const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(formatResponse(false, null, 'Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'admin') {
      return res.status(403).json(formatResponse(false, null, 'Admin access required'));
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json(formatResponse(false, null, 'Invalid or expired token'));
  }
};

export const authenticateAny = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(formatResponse(false, null, 'Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(formatResponse(false, null, 'Invalid or expired token'));
  }
};
