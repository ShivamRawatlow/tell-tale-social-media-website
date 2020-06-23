"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const comment_1 = require("../models/comment");
const auth_1 = require("../middleware/auth");
const post_1 = require("../models/post");
exports.commentRouter = express_1.default.Router();
exports.commentRouter.post('/me/comment', auth_1.auth, async (req, res) => {
    try {
        const sender = req.user;
        const receiver = await post_1.Post.findById(req.body.postId);
        const description = req.body.description;
        if (!sender || !receiver || !description) {
            res.status(400).send();
        }
        const comment = new comment_1.Comment({
            description,
            sender,
            receiver,
        });
        await comment.save();
        await (receiver === null || receiver === void 0 ? void 0 : receiver.populate('comments').execPopulate());
        //await receiver?.populate('likes').execPopulate();
        // await receiver?.populate('owner').execPopulate();
        for (let j = 0; j < receiver.comments.length; j++) {
            await receiver.comments[j].populate('sender').execPopulate();
        }
        res.status(201).send(receiver === null || receiver === void 0 ? void 0 : receiver.comments);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.commentRouter.delete('/me/post/comment/:commentId', auth_1.auth, async (req, res) => {
    try {
        const comment = await comment_1.Comment.findByIdAndDelete(req.params.commentId);
        if (!comment) {
            return res.status(400).send();
        }
        res.send(comment);
    }
    catch (error) {
        res.status(500).send();
    }
});
//getcomments of post
exports.commentRouter.get('/post/comment/:postId', async (req, res) => {
    try {
        const post = await post_1.Post.findById(req.params.postId);
        if (!post) {
            res.status(400).send();
        }
        await (post === null || post === void 0 ? void 0 : post.populate('comments').execPopulate());
        for (let j = 0; j < post.comments.length; j++) {
            await post.comments[j].populate('sender').execPopulate();
        }
        res.status(201).send(post === null || post === void 0 ? void 0 : post.comments);
    }
    catch (error) {
        res.status(500).send();
    }
});
exports.commentRouter.patch('/me/post/comment/:commentId', auth_1.auth, async (req, res) => {
    const allowedUpdates = ['description'];
    const updates = Object.keys(req.body); //keys will be retured in an array of string
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' });
    }
    try {
        const comment = await comment_1.Comment.findOne({
            _id: req.params.commentId,
            sender: req.user._id,
        });
        console.log(comment);
        if (!comment) {
            return res.status(404).send();
        }
        const tempComment = req.body;
        if (tempComment.description) {
            comment.description = tempComment.description;
        }
        await comment.save();
        const post = await post_1.Post.findById(comment.receiver);
        if (!post) {
            return res.status(404).send();
        }
        await post.populate('comments').execPopulate();
        res.status(200).send(post);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
