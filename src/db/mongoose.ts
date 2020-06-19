import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URL as string, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
