import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
}

const likeSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
  },
  {
    timestamps: true,
  }
);

export const Like = mongoose.model<ILike>('Like', likeSchema);
