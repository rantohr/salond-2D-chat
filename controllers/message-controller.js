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
exports.SendMessage = exports.AllMessages = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const message_model_1 = require("../models/message-model");
const user_model_1 = require("../models/user-model");
const chat_model_1 = require("../models/chat-model");
exports.AllMessages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield message_model_1.Message.find({ chat: req.params.chatId })
            .populate("sender", "name picture email")
            .populate("chat");
        res.json(messages);
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}));
exports.SendMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, chatId } = req.body;
    if (!content || !chatId)
        res.sendStatus(400);
    let newMessage = { sender: req.user._id, content: content, chat: chatId };
    try {
        let message = yield message_model_1.Message.create(newMessage);
        message = yield message.populate("sender", "name picture");
        message = yield message.populate("chat");
        message = yield user_model_1.User.populate(message, {
            path: "chat.users",
            select: "name picture email",
        });
        yield chat_model_1.Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.json(message);
    }
    catch (error) {
        console.log("🚀 ~ SendMessage ~ error:", error);
        res.status(400);
        throw new Error(error.message);
    }
}));
