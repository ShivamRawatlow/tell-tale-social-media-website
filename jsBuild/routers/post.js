"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const post_1 = require("../models/post");
const auth_1 = require("../middleware/auth");
const mongoose_1 = __importDefault(require("mongoose"));
const like_1 = require("../models/like");
const comment_1 = require("../models/comment");
exports.postRouter = express_1.default.Router();
exports.postRouter.post('/me/post', auth_1.auth, async (req, res) => {
    try {
        const post = new post_1.Post({
            description: req.body.description,
            owner: req.user._id,
            picUrl: req.body.picUrl,
        });
        await post.save();
        res.status(201).send(post);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.postRouter.get('/post/allposts', async (req, res) => {
    try {
        const allPosts = await post_1.Post.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip));
        for (let i = 0; i < allPosts.length; i++) {
            await allPosts[i].populate('owner').execPopulate();
            await allPosts[i].populate('likes').execPopulate();
            await allPosts[i].populate('comments').execPopulate();
            for (let j = 0; j < allPosts[i].comments.length; j++) {
                await allPosts[i].comments[j].populate('sender').execPopulate();
            }
        }
        res.send(allPosts);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.postRouter.get('/post/followerspost', auth_1.auth, async (req, res) => {
    try {
        const user = req.user;
        await user.populate('following').execPopulate();
        const allPosts = await post_1.Post.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip));
        const followersPost = [];
        const followReceivers = [];
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
    }
    catch (error) {
        res.status(500).send(error);
    }
});
//get single post
exports.postRouter.get('/user/post/:postId', async (req, res) => {
    try {
        const post = await post_1.Post.findById(req.params.postId);
        if (!post) {
            res.status(404).send();
        }
        res.status(200).send(post);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
//get user posts
exports.postRouter.get('/user/posts/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userObject = mongoose_1.default.Types.ObjectId(userId);
        const posts = await post_1.Post.find({ owner: userObject }).sort({
            createdAt: -1,
        });
        if (!posts) {
            res.status(404).send();
        }
        res.status(200).send(posts);
    }
    catch (error) {
        res.status(500).send();
    }
});
exports.postRouter.patch('/me/post/:postId', auth_1.auth, async (req, res) => {
    const allowedUpdates = ['description'];
    const updates = Object.keys(req.body); //keys will be retured in an array of string
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' });
    }
    try {
        const post = await post_1.Post.findOne({
            _id: req.params.postId,
            owner: req.user._id,
        });
        if (!post) {
            return res.status(404).send();
        }
        const tempPost = req.body;
        if (tempPost.description) {
            post.description = tempPost.description;
        }
        await post.save();
        res.status(200).send(post);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.postRouter.delete('/me/post/:postId', auth_1.auth, async (req, res) => {
    try {
        const post = await post_1.Post.findByIdAndDelete(req.params.postId);
        if (!post) {
            return res.status(404).send();
        }
        // if (post.owner === req.user._id) {
        //   const deletedPost = await Post.findByIdAndDelete(post._id);
        // }
        const obj = { receiver: post._id };
        await like_1.Like.deleteMany(obj);
        await comment_1.Comment.deleteMany(obj);
        res.status(201).send(post);
    }
    catch (error) {
        res.status(500).send();
    }
});
