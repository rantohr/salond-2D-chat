"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const chat_controller_1 = require("../controllers/chat-controller");
exports.ChatRoutes = express_1.default.Router();
exports.ChatRoutes.route("/").post(auth_middleware_1.protect, chat_controller_1.AccessChat);
exports.ChatRoutes.route("/").get(auth_middleware_1.protect, chat_controller_1.FetchChat);
exports.ChatRoutes.route("/channel").post(auth_middleware_1.protect, chat_controller_1.CreateChannel);
exports.ChatRoutes.route("/rename").put(auth_middleware_1.protect, chat_controller_1.RenameChannel);
exports.ChatRoutes.route("/channel-remove").put(auth_middleware_1.protect, chat_controller_1.RemoveFromChannel);
exports.ChatRoutes.route("/channel-add").put(auth_middleware_1.protect, chat_controller_1.AddToChannel);
