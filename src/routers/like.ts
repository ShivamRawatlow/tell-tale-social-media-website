import express, { Request, Response, NextFunction } from 'express';
import { Like, ILike } from '../models/like';
import { auth } from '../middleware/auth';
import { Post } from '../models/post';
import Mongoose from 'mongoose';

export const likeRouter = express.Router();

likeRouter.post(
  '/me/like/:postId',
  auth,
  async (req: Request, res: Response) => {
    try {
      const sender = req.user;
      const post = await Post.findById(req.params.postId);

      if (!sender || !post) {
        res.status(400).send();
      }

      const like = new Like({
        sender,
        receiver: post,
      });

      await like.save();

      await post?.populate('likes').execPopulate();
      // await post?.populate('comments').execPopulate();
      // await post?.populate('owner').execPopulate();
      // for (let j = 0; j < post!.comments.length; j++) {
      //   await post!.comments[j].populate('sender').execPopulate();
      // }

      res.status(201).send(post?.likes);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

likeRouter.post(
  '/me/unlike/:likeId',
  auth,
  async (req: Request, res: Response) => {
    try {
      const like = await Like.findByIdAndDelete(req.params.likeId);

      if (!like) {
        res.status(500).send('LikeId is not present');
      }

      const post = await Post.findById(like?.receiver);
      await post?.populate('likes').execPopulate();
      // await post?.populate('owner').execPopulate();
      // await post?.populate('comments').execPopulate();
      // for (let j = 0; j < post!.comments.length; j++) {
      //   await post!.comments[j].populate('sender').execPopulate();
      // }

      res.status(201).send(post?.likes);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

// likeRouter.get('/post/like/:postId', async (req: Request, res: Response) => {
//   try {
//     const postIdObj: any = Mongoose.Types.ObjectId(req.params.postId);
//     const likes = await Like.find({ receiver: postIdObj });

//     for (let i = 0; i < likes.length; i++) {
//       await likes[i].populate('sender').execPopulate();
//     }

//     res.status(200).send(likes);
//   } catch (error) {
//     res.status(500).send();
//   }
// });
