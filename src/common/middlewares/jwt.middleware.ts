import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from '../constants';
import * as jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).send('A token is required for authentication');
    }
    jwt.verify(token, JWT_SECRET);

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};
