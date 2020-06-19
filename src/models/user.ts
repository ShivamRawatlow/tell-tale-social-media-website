import mongoose, { Schema, Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IPost, Post } from './post';
import { Like } from './like';
import { Follow, IFollow } from './follow';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: Array<{ _id: string; token: string }>;
  picUrl: string;

  //Virtual
  posts: Array<IPost>;
  followers: Array<IFollow>;
  following: Array<IFollow>;

  //Extension Function
  generateAuthToken(): Promise<string>;
}

// for static functions
export interface IStaticUser extends Model<IUser> {
  findByCredentials(email: string, password: string): Promise<IUser>;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value: string): boolean {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        } else {
          return true;
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,

      validate(value: string): boolean {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain "password" ');
          return false;
        } else {
          return true;
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    picUrl: {
      type: String,
      default:
        'https://res.cloudinary.com/shivamcloud/image/upload/v1592551612/telltale_images/ycbqlq6veulyjeaq35br.png',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'owner',
});

userSchema.virtual('followers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'receiver',
});

userSchema.virtual('following', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'sender',
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject(); // this inbuilt mongoose function returns
  //just the object data without any inbuilt function

  delete userObject.password;
  delete userObject.tokens;

  //console.log(userObject);

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  //methods are accessible on the instances
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET as string
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (
  email: string,
  password: string
) => {
  //static methods are accessible on the models
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login: Wrong Password');
  }
  return user;
};

//Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user: IUser = this as IUser; // 'this' is the user being saved
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//Delete user tasks when user is removed
userSchema.pre('delete', async function (next) {
  const user: IUser = this as IUser; // 'this' is the user being saved.
  await Like.deleteMany({ sender: user._id });
  await Post.deleteMany({ sender: user._id });
  await Follow.deleteMany({ sender: user._id });
  await Post.deleteMany({ owner: user._id });

  next();
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export const User = mongoose.model<IUser, IStaticUser>('User', userSchema);
