import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB!);
    console.log(`Kết nối thành công với host: ${conn.connection.host}`);
  } catch (error) {
    console.log("Có lỗi khi kết nối đến database", error);
    process.exit(1);
  }
};
