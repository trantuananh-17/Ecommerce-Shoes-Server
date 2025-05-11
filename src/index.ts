import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/mongodb.config";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  connectDB();
});
