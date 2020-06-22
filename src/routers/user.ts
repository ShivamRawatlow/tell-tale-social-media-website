import { Request, Response, NextFunction, Router } from 'express';

import { User, IUser } from '../models/user';
import { auth } from '../middleware/auth';

export const userRouter = Router();

userRouter.get('/me', auth, async (req: Request, res: Response) => {
  try {
    const me = req.user;
    await me.populate('posts').execPopulate();
    await me.populate('followers').execPopulate();
    await me.populate('following').execPopulate();

    res.send(me);
  } catch (error) {
    res.status(401).send(error);
  }
});

userRouter.get('/user/allusers', auth, async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find();
    res.status(200).send(allUsers);
  } catch (error) {
    res.status(500).send(error);
  }
});

//get one user by id
userRouter.get('/user/:userId', auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(401).send();
    }
    await user?.populate('posts').execPopulate();
    await user?.populate('followers').execPopulate();
    await user?.populate('following').execPopulate();

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

userRouter.post('/user/signup', async (req: Request, res: Response) => {
  try {
    const user = new User({
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
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.post('/user/login', async (req: Request, res: Response) => {
  try {
    const user: IUser = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    await user.populate('posts').execPopulate();
    await user.populate('followers').execPopulate();
    await user.populate('following').execPopulate();

    const message = 'login successful';
    res.send({ user, token, message });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

userRouter.post('/me/logout', auth, async (req: Request, res: Response) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      //saving tokens which are not equal to the req token
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

userRouter.post('/me/logoutAll', auth, async (req: Request, res: Response) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

userRouter.post('/user/search', async (req, res) => {
  try {
    let userPattern = new RegExp('^' + req.body.query);
    const users = await User.find({ name: { $regex: userPattern } });
    res.status(201).send(users);
  } catch (error) {
    res.status(404).send(error);
  }
});

userRouter.patch('/me', auth, async (req: Request, res: Response) => {
  const allowedUpdates = ['name', 'email', 'password', 'picUrl'];
  const updates = Object.keys(req.body); //keys will be retured in an array of string
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates!' });
  }

  try {
    const tempUser: IUser = req.body;

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
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.delete('/me', auth, async (req: Request, res: Response) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (error) {
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
