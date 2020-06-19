import express, { Request, Response, NextFunction } from 'express';
import { Post, IPost } from '../models/post';
import { auth } from '../middleware/auth';
import Mongoose from 'mongoose';
import { Like } from '../models/like';
import { Comment } from '../models/comment';

export const postRouter = express.Router();

postRouter.post('/me/post', auth, async (req: Request, res: Response) => {
  try {
    const post = new Post({
      description: req.body.description,
      owner: req.user._id,
      picUrl: req.body.picUrl,
    });

    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

postRouter.get('/post/allposts', async (req: Request, res: Response) => {
  try {
    const allPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit as string))
      .skip(parseInt(req.query.skip as string));

    for (let i = 0; i < allPosts.length; i++) {
      await allPosts[i].populate('owner').execPopulate();
      await allPosts[i].populate('likes').execPopulate();
      await allPosts[i].populate('comments').execPopulate();
      for (let j = 0; j < allPosts[i].comments.length; j++) {
        await allPosts[i].comments[j].populate('sender').execPopulate();
      }
    }

    res.send(allPosts);
  } catch (error) {
    res.status(500).send(error);
  }
});

postRouter.get(
  '/post/followerspost',
  auth,
  async (req: Request, res: Response) => {
    try {
      const user = req.user;

      await user.populate('following').execPopulate();

      const allPosts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(parseInt(req.query.limit as string))
        .skip(parseInt(req.query.skip as string));

      const followersPost: IPost[] = [];

      const followReceivers: string[] = [];

      user.following.forEach((follower) => {
        const followerStr = follower.receiver.toString();
        followReceivers.push(followerStr);
      });

      allPosts.forEach((post) => {
        if (followReceivers.includes(post.owner.toString())) {
          followersPost.push(post);
        }
      });

      for (let i = 0; i < followersPost.length; i++) {
        await followersPost[i].populate('owner').execPopulate();
        await followersPost[i].populate('likes').execPopulate();
        await followersPost[i].populate('comments').execPopulate();
        for (let j = 0; j < followersPost[i].comments.length; j++) {
          await followersPost[i].comments[j].populate('sender').execPopulate();
        }
      }

      res.send(followersPost);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

//get single post
postRouter.get('/user/post/:postId', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get user posts
postRouter.get('/user/posts/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userObject: any = Mongoose.Types.ObjectId(userId);

    const posts = await Post.find({ owner: userObject }).sort({
      createdAt: -1,
    });

    if (!posts) {
      res.status(404).send();
    }

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send();
  }
});

postRouter.patch(
  '/me/post/:postId',
  auth,
  async (req: Request, res: Response) => {
    const allowedUpdates = ['description'];
    const updates = Object.keys(req.body); //keys will be retured in an array of string
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid Updates!' });
    }

    try {
      const post = await Post.findOne({
        _id: req.params.postId,
        owner: req.user._id,
      });
      if (!post) {
        return res.status(404).send();
      }
      const tempPost: IPost = req.body;

      if (tempPost.description) {
        post.description = tempPost.description;
      }

      await post.save();
      res.status(200).send(post);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

postRouter.delete(
  '/me/post/:postId',
  auth,
  async (req: Request, res: Response) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.postId);
      if (!post) {
        return res.status(404).send();
      }

      // if (post.owner === req.user._id) {
      //   const deletedPost = await Post.findByIdAndDelete(post._id);
      // }

      const obj = { receiver: post._id };
      await Like.deleteMany(obj);
      await Comment.deleteMany(obj);

      res.status(201).send(post);
    } catch (error) {
      res.status(500).send();
    }
  }
);
