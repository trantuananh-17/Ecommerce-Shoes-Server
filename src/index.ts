import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/mongodb.config";
import i18n from "./middleware/i18n.middleware";
import routes from "./routes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(i18n.init);

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  connectDB();
});
