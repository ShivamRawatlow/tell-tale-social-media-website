"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const postSchema = new mongoose_1.Schema({
    description: {
        type: String,
        trim: true,
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    picUrl: {
        type: String,
    },
}, {
    timestamps: true,
});
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
exports.Post = mongoose_1.default.model('Post', postSchema);
