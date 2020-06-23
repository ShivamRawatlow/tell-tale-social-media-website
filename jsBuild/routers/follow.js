"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followRouter = void 0;
const express_1 = __importDefault(require("express"));
const follow_1 = require("../models/follow");
const auth_1 = require("../middleware/auth");
const user_1 = require("../models/user");
exports.followRouter = express_1.default.Router();
exports.followRouter.post('/me/follow/:userId', auth_1.auth, async (req, res) => {
    try {
        const sender = req.user;
        const receiver = await user_1.User.findById(req.params.userId);
        if (!sender || !receiver) {
            res.status(400).send();
        }
        const follow = new follow_1.Follow({
            sender,
            receiver,
        });
        await follow.save();
        // await receiver?.populate('posts').execPopulate();
        await (receiver === null || receiver === void 0 ? void 0 : receiver.populate('followers').execPopulate());
        // await receiver?.populate('following').execPopulate();
        res.status(201).send(receiver === null || receiver === void 0 ? void 0 : receiver.followers);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.followRouter.post('/me/unfollow/:followId', auth_1.auth, async (req, res) => {
    try {
        const follow = await follow_1.Follow.findByIdAndDelete(req.params.followId);
        if (!follow) {
            res.status(400).send();
        }
        const receiver = await user_1.User.findById(follow === null || follow === void 0 ? void 0 : follow.receiver);
        // await receiver?.populate('posts').execPopulate();
        await (receiver === null || receiver === void 0 ? void 0 : receiver.populate('followers').execPopulate());
        //await receiver?.populate('following').execPopulate();
        res.status(201).send(receiver === null || receiver === void 0 ? void 0 : receiver.followers);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
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
