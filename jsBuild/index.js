"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./routers/user");
const post_1 = require("./routers/post");
const like_1 = require("./routers/like");
const comment_1 = require("./routers/comment");
const follow_1 = require("./routers/follow");
const path_1 = __importDefault(require("path"));
//import cors from 'cors';
require('./db/mongoose'); // no need to save in variable(only to ensure that database runs)
const app = express_1.default();
//app.use(cors());
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(user_1.userRouter);
app.use(post_1.postRouter);
app.use(like_1.likeRouter);
app.use(comment_1.commentRouter);
app.use(follow_1.followRouter);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
