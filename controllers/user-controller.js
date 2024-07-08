"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllUsers = exports.AuthUser = exports.RegisterUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generate_token_1 = require("../config/generate-token");
const user_model_1 = require("../models/user-model");
exports.RegisterUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, picture } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Fields");
    }
    const userExists = yield user_model_1.User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = yield user_model_1.User.create({ name, email, password, picture });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            picture: user.profilePicture,
            token: (0, generate_token_1.generateToken)(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error("User not found");
    }
}));
exports.AuthUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.User.findOne({ email });
    if (user && (yield user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            picture: user.profilePicture,
            token: (0, generate_token_1.generateToken)(user._id),
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
}));
exports.AllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    const users = yield user_model_1.User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
}));
