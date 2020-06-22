import express from 'express';
import { userRouter } from './routers/user';
import { postRouter } from './routers/post';
import { likeRouter } from './routers/like';
import { commentRouter } from './routers/comment';
import { followRouter } from './routers/follow';
import path from 'path';
import cors from 'cors';

require('./db/mongoose'); // no need to save in variable(only to ensure that database runs)

const app = express();

app.use(cors());
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(postRouter);
app.use(likeRouter);
app.use(commentRouter);
app.use(followRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  
  console.log('Server is up on port ' + port);


});
