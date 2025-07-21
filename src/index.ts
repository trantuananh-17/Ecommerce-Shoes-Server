import routes from "./routes";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/mongodb.config";
import { getLangFromHeader } from "./middleware/pipe/language.middleware";
import logRequestTime from "./middleware/pipe/winston.middleware";
import i18n from "./config/i18n.config";
import cookieParser from "cookie-parser";
import { initSocket } from "./config/socket.config";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const bucketName = process.env.AWS_NAME;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(i18n.init);
app.use(getLangFromHeader);
app.use(logRequestTime);

app.use("/api", routes);

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  connectDB();
});
