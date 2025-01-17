"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    content: { type: String, trim: true },
    chat: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Chat",
    },
}, {
    timestamps: true,
});
exports.Message = mongoose_1.default.model("Message", MessageSchema);
