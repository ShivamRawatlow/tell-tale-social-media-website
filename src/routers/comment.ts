import express, { Request, Response } from 'express';
import { Comment, IComment } from '../models/comment';
import { auth } from '../middleware/auth';
import { Post } from '../models/post';

export const commentRouter = express.Router();

commentRouter.post('/me/comment', auth, async (req: Request, res: Response) => {
  try {
    const sender = req.user;
    const receiver = await Post.findById(req.body.postId);
    const description = req.body.description;

    if (!sender || !receiver || !description) {
      res.status(400).send();
    }

    const comment = new Comment({
      description,
      sender,
      receiver,
    });

    await comment.save();

    await receiver?.populate('comments').execPopulate();
    //await receiver?.populate('likes').execPopulate();
    // await receiver?.populate('owner').execPopulate();

    for (let j = 0; j < receiver!.comments.length; j++) {
      await receiver!.comments[j].populate('sender').execPopulate();
    }

    res.status(201).send(receiver?.comments);
  } catch (error) {
    res.status(500).send(error);
  }
});

commentRouter.delete(
  '/me/post/comment/:commentId',
  auth,
  async (req: Request, res: Response) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.commentId);

      if (!comment) {
        return res.status(400).send();
      }
      res.send(comment);
    } catch (error) {
      res.status(500).send();
    }
  }
);

//getcomments of post
commentRouter.get(
  '/post/comment/:postId',
  async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        res.status(400).send();
      }

      await post?.populate('comments').execPopulate();
      for (let j = 0; j < post!.comments.length; j++) {
        await post!.comments[j].populate('sender').execPopulate();
      }

      res.status(201).send(post?.comments);
    } catch (error) {
      res.status(500).send();
    }
  }
);

commentRouter.patch(
  '/me/post/comment/:commentId',
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
      const comment = await Comment.findOne({
        _id: req.params.commentId,
        sender: req.user._id,
      });
      console.log(comment);
      if (!comment) {
        return res.status(404).send();
      }
      const tempComment: IComment = req.body;

      if (tempComment.description) {
        comment.description = tempComment.description;
      }

      await comment.save();

      const post = await Post.findById(comment.receiver);
      if (!post) {
        return res.status(404).send();
      }

      await post.populate('comments').execPopulate();
      res.status(200).send(post);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
