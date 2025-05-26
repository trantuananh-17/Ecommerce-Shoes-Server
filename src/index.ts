import routes from "./routes";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/mongodb.config";
import { getLangFromHeader } from "./middleware/pipe/language.middleware";
import logRequestTime from "./middleware/pipe/winston.middleware";
import i18n from "./config/i18n.config";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use(i18n.init);
app.use(getLangFromHeader);
app.use(logRequestTime);

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  connectDB();
});
