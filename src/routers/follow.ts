import express, { Request, Response } from 'express';
import { Follow } from '../models/follow';
import { auth } from '../middleware/auth';
import { User } from '../models/user';
import Mongoose from 'mongoose';

export const followRouter = express.Router();

followRouter.post(
  '/me/follow/:userId',
  auth,
  async (req: Request, res: Response) => {
    try {
      const sender = req.user;
      const receiver = await User.findById(req.params.userId);

      if (!sender || !receiver) {
        res.status(400).send();
      }

      const follow = new Follow({
        sender,
        receiver,
      });

      await follow.save();

     // await receiver?.populate('posts').execPopulate();
      await receiver?.populate('followers').execPopulate();
     // await receiver?.populate('following').execPopulate();

      res.status(201).send(receiver?.followers);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

followRouter.post(
  '/me/unfollow/:followId',
  auth,
  async (req: Request, res: Response) => {
    try {
      const follow = await Follow.findByIdAndDelete(req.params.followId);

      if (!follow) {
        res.status(400).send();
      }

      const receiver = await User.findById(follow?.receiver);
     // await receiver?.populate('posts').execPopulate();
      await receiver?.populate('followers').execPopulate();
      //await receiver?.populate('following').execPopulate();

      res.status(201).send(receiver?.followers);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

// followRouter.get(
//   '/user/follow/:userId',
//   async (req: Request, res: Response) => {
//     try {
//       const userIdObj: any = Mongoose.Types.ObjectId(req.params.userId);
//       const follows = await Follow.find({ receiver: userIdObj });

//       const totalFollowers = follows.length.toString();

//       res.status(200).send(totalFollowers);
//     } catch (error) {
//       res.status(500).send();
//     }
//   }
// );
