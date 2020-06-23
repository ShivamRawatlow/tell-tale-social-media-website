"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', ''); //replacing bearer with nothing
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_1.User.findOne({
            _id: decoded._id,
            'tokens.token': token,
        });
        if (!user) {
            throw new Error('No user found with the given token');
        }
        req.token = token;
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};
