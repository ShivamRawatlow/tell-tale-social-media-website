"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_1 = require("../models/user");
const auth_1 = require("../middleware/auth");
exports.userRouter = express_1.Router();
exports.userRouter.get('/me', auth_1.auth, async (req, res) => {
    try {
        const me = req.user;
        await me.populate('posts').execPopulate();
        await me.populate('followers').execPopulate();
        await me.populate('following').execPopulate();
        res.send(me);
    }
    catch (error) {
        res.status(401).send(error);
    }
});
exports.userRouter.get('/user/allusers', auth_1.auth, async (req, res) => {
    try {
        const allUsers = await user_1.User.find();
        res.status(200).send(allUsers);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
//get one user by id
exports.userRouter.get('/user/:userId', auth_1.auth, async (req, res) => {
    try {
        const user = await user_1.User.findById(req.params.userId);
        if (!user) {
            res.status(401).send();
        }
        await (user === null || user === void 0 ? void 0 : user.populate('posts').execPopulate());
        await (user === null || user === void 0 ? void 0 : user.populate('followers').execPopulate());
        await (user === null || user === void 0 ? void 0 : user.populate('following').execPopulate());
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.userRouter.post('/user/signup', async (req, res) => {
    try {
        const user = new user_1.User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            picUrl: req.body.picUrl,
        });
        await user.save();
        const token = await user.generateAuthToken();
        await user.populate('posts').execPopulate();
        await user.populate('followers').execPopulate();
        await user.populate('following').execPopulate();
        const message = 'user saved successfully';
        res.status(201).send({ user, token, message });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
});
exports.userRouter.post('/user/login', async (req, res) => {
    try {
        const user = await user_1.User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        await user.populate('posts').execPopulate();
        await user.populate('followers').execPopulate();
        await user.populate('following').execPopulate();
        const message = 'login successful';
        res.send({ user, token, message });
    }
    catch (error) {
        res.status(401).send(error.message);
    }
});
exports.userRouter.post('/me/logout', auth_1.auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            //saving tokens which are not equal to the req token
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    }
    catch (error) {
        res.status(500).send();
    }
});
exports.userRouter.post('/me/logoutAll', auth_1.auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }
    catch (error) {
        res.status(500).send();
    }
});
exports.userRouter.post('/user/search', async (req, res) => {
    try {
        let userPattern = new RegExp('^' + req.body.query);
        const users = await user_1.User.find({ name: { $regex: userPattern } });
        res.status(201).send(users);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.userRouter.patch('/me', auth_1.auth, async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'picUrl'];
    const updates = Object.keys(req.body); //keys will be retured in an array of string
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' });
    }
    try {
        const tempUser = req.body;
        if (tempUser.name) {
            req.user.name = tempUser.name;
        }
        if (tempUser.email) {
            req.user.email = tempUser.email;
        }
        if (tempUser.password) {
            req.user.password = tempUser.password;
        }
        if (tempUser.picUrl) {
            req.user.picUrl = tempUser.picUrl;
        }
        await req.user.save();
        res.send(req.user);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.userRouter.delete('/me', auth_1.auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    }
    catch (error) {
        res.status(500).send();
    }
});
// userRouter.post(
//   '/me/pic',
//   auth,
//   uploadPic.single('pic'),
//   async (req: Request, res: Response) => {
//     const buffer = await sharp(req.file.buffer)
//       .resize({ width: 250, height: 250 })
//       .png()
//       .toBuffer(); //modifying image
//     await req.user.save();
//     res.send();
//   },
//   (error: Error, req: Request, res: Response, next: NextFunction) => {
//     // to provide custom error when wrong file is uploaded
//     res.status(400).send({ error: error.message });
//   }
// );
// userRouter.delete(
//   '/user/me/avatar',
//   auth,
//   upload.single('avatar'),
//   async (req: Request, res: Response) => {
//     req.user.avatar = undefined;
//     await req.user.save();
//     res.send();
//   }
// );
// userRouter.get('/user/:id/avatar', async (req: Request, res: Response) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user || !user.pic) {
//       throw new Error();
//     }
//     res.set('Content-Type', 'image/png');
//     res.send(user.pic);
//   } catch (error) {
//     res.status(404).send();
//   }
// });
