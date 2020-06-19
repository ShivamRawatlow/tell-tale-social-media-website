import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  description: string;
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
}

const commentSchema = new Schema(
  {
    description: {
      type: String,
      trim: true,
    },
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

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
