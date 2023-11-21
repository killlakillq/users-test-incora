import { NextFunction, Request, Response } from 'express';

export const tryCatch = (cb: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      return res.status(500).json({
        message: 'Something went wrong',
        error: error.message
      });
    }
  };
};
