"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user-controller");
const auth_middleware_1 = require("../middleware/auth-middleware");
exports.UserRoutes = express_1.default.Router();
exports.UserRoutes.route("/").post(user_controller_1.RegisterUser).get(auth_middleware_1.protect, user_controller_1.AllUsers);
exports.UserRoutes.route("/login").post(user_controller_1.AuthUser);
