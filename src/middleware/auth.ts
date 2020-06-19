import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      token: string;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')!.replace('Bearer ', ''); //replacing bearer with nothing
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as IUser;
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error('No user found with the given token');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
