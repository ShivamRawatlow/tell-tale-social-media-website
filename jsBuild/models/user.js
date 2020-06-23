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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const post_1 = require("./post");
const like_1 = require("./like");
const follow_1 = require("./follow");
const userSchema = new mongoose_1.Schema({
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
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Email is invalid');
            }
            else {
                return true;
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password" ');
                return false;
            }
            else {
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
        default: 'https://res.cloudinary.com/shivamcloud/image/upload/v1592551612/telltale_images/ycbqlq6veulyjeaq35br.png',
    },
}, {
    timestamps: true,
});
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
    const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};
userSchema.statics.findByCredentials = async (email, password) => {
    //static methods are accessible on the models
    const user = await exports.User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login: Wrong Password');
    }
    return user;
};
//Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this; // 'this' is the user being saved
    if (user.isModified('password')) {
        user.password = await bcrypt_1.default.hash(user.password, 8);
    }
    next();
});
//Delete user tasks when user is removed
userSchema.pre('delete', async function (next) {
    const user = this; // 'this' is the user being saved.
    await like_1.Like.deleteMany({ sender: user._id });
    await post_1.Post.deleteMany({ sender: user._id });
    await follow_1.Follow.deleteMany({ sender: user._id });
    await post_1.Post.deleteMany({ owner: user._id });
    next();
});
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });
exports.User = mongoose_1.default.model('User', userSchema);
