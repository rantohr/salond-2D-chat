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
exports.AddToChannel = exports.RemoveFromChannel = exports.RenameChannel = exports.CreateChannel = exports.FetchChat = exports.AccessChat = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = require("../models/user-model");
const chat_model_1 = require("../models/chat-model");
exports.AccessChat = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        console.log("UserId param not sent with request");
        res.sendStatus(400);
        return;
    }
    let isChat = yield chat_model_1.Chat.find({
        isChannel: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");
    isChat = yield user_model_1.User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name picture email",
    });
    if (isChat.length > 0) {
        res.send(isChat[0]);
        return;
    }
    else {
        let chatData = {
            chatName: "sender",
            isChannel: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = yield chat_model_1.Chat.create(chatData);
            const fullChat = yield chat_model_1.Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).json(fullChat);
            return;
        }
        catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
}));
exports.FetchChat = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        chat_model_1.Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("channelAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then((results) => __awaiter(void 0, void 0, void 0, function* () {
            results = yield user_model_1.User.populate(results, {
                path: "latestMessage.sender",
                select: "name picture email",
            });
            res.status(200).send(results);
        }));
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}));
exports.CreateChannel = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.users || !req.body.name) {
        res.status(400).send({ message: "Please Fill all the feilds" });
        return;
    }
    let users = JSON.parse(req.body.users);
    if (users.length < 2) {
        res
            .status(400)
            .send("More than 2 users are required to form a channel");
        return;
    }
    users.push(req.user);
    try {
        const channel = yield chat_model_1.Chat.create({
            chatName: req.body.name,
            users: users,
            isChannel: true,
            channelAdmin: req.user,
        });
        const fullChannelChat = yield chat_model_1.Chat.findOne({ _id: channel._id })
            .populate("users", "-password")
            .populate("channelAdmin", "-password");
        res.status(200).json(fullChannelChat);
        return;
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}));
exports.RenameChannel = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, chatName } = req.body;
    const updatedChat = yield chat_model_1.Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
        .populate("users", "-password")
        .populate("channelAdmin", "-password");
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(updatedChat);
    }
}));
exports.RemoveFromChannel = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, userId } = req.body;
    const removed = yield chat_model_1.Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("channelAdmin", "-password");
    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(removed);
    }
}));
exports.AddToChannel = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, userId } = req.body;
    const added = yield chat_model_1.Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("channelAdmin", "-password");
    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.json(added);
    }
}));
