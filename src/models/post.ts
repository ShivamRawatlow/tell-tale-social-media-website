import mongoose, { Schema, Document } from 'mongoose';
import { ILike, Like } from './like';
import { IComment, Comment } from './comment';

export interface IPost extends Document {
  description: string;
  picUrl: string;
  owner: Schema.Types.ObjectId;
  likes: Array<ILike>;
  comments: Array<IComment>;
}

const postSchema = new Schema(
  {
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    picUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'receiver',
});

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'receiver',
});

//findById and delete hooks does not exist so use findOneAndDelete

// postSchema.pre('findOneAndDelete', async function (next) {
//   const post: IPost = this as IPost; // 'this' is the user being saved.
//   console.log('pre called');
//   console.log('this is ', this);
//   const res1 = await Like.deleteMany({ receiver: post._id });
//   const res2 = await Comment.deleteMany({ receiver: post._id });

//   console.log('res1', res1);
//   console.log('res2', res2);

//   next();
// });

postSchema.set('toJSON', { virtuals: true });

export const Post = mongoose.model<IPost>('Post', postSchema);
