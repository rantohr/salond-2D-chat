"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const user_routes_1 = require("./routes/user-routes");
const error_middleware_1 = require("./middleware/error-middleware");
const chat_routes_1 = require("./routes/chat-routes");
const message_routes_1 = require("./routes/message-routes");
//For env File
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.APP_PORT || 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: true }));
(0, db_1.connectDb)();
app.use("/api/user", user_routes_1.UserRoutes);
app.use("/api/chat", chat_routes_1.ChatRoutes);
app.use("/api/message", message_routes_1.MessagerRoutes);
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
const server = app.listen(port, () => {
    console.log(`Server is Fire`);
});
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: { origin: "*" },
});
io.on("connection", (socket) => {
    console.log("Connected to Socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("send message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users)
            return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if (user._id === newMessageRecieved.sender._id)
                return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });
    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
