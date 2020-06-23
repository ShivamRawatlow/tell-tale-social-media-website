"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeRouter = void 0;
const express_1 = __importDefault(require("express"));
const like_1 = require("../models/like");
const auth_1 = require("../middleware/auth");
const post_1 = require("../models/post");
exports.likeRouter = express_1.default.Router();
exports.likeRouter.post('/me/like/:postId', auth_1.auth, async (req, res) => {
    try {
        const sender = req.user;
        const post = await post_1.Post.findById(req.params.postId);
        if (!sender || !post) {
            res.status(400).send();
        }
        const like = new like_1.Like({
            sender,
            receiver: post,
        });
        await like.save();
        await (post === null || post === void 0 ? void 0 : post.populate('likes').execPopulate());
        // await post?.populate('comments').execPopulate();
        // await post?.populate('owner').execPopulate();
        // for (let j = 0; j < post!.comments.length; j++) {
        //   await post!.comments[j].populate('sender').execPopulate();
        // }
        res.status(201).send(post === null || post === void 0 ? void 0 : post.likes);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.likeRouter.post('/me/unlike/:likeId', auth_1.auth, async (req, res) => {
    try {
        const like = await like_1.Like.findByIdAndDelete(req.params.likeId);
        if (!like) {
            res.status(500).send('LikeId is not present');
        }
        const post = await post_1.Post.findById(like === null || like === void 0 ? void 0 : like.receiver);
        await (post === null || post === void 0 ? void 0 : post.populate('likes').execPopulate());
        // await post?.populate('owner').execPopulate();
        // await post?.populate('comments').execPopulate();
        // for (let j = 0; j < post!.comments.length; j++) {
        //   await post!.comments[j].populate('sender').execPopulate();
        // }
        res.status(201).send(post === null || post === void 0 ? void 0 : post.likes);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
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
