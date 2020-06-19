import mongoose, { Schema, Document } from 'mongoose';

export interface IFollow extends Document {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
}

const followSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Follow = mongoose.model<IFollow>('Follow', followSchema);
