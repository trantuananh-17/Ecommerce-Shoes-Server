import { Server } from "socket.io";
import { Socket } from "socket.io";

// Hàm khởi tạo socket
export const initSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  return io;
};
