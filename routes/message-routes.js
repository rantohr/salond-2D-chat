"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const message_controller_1 = require("../controllers/message-controller");
exports.MessagerRoutes = express_1.default.Router();
exports.MessagerRoutes.route("/:chatId").get(auth_middleware_1.protect, message_controller_1.AllMessages);
exports.MessagerRoutes.route("/").post(auth_middleware_1.protect, message_controller_1.SendMessage);
