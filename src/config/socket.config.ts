import { Server } from "socket.io";

let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {});
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO chưa được khởi tạo!");
  }
  return io;
};
