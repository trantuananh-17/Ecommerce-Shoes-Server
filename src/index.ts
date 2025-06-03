import routes from "./routes";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/mongodb.config";
import { getLangFromHeader } from "./middleware/pipe/language.middleware";
import logRequestTime from "./middleware/pipe/winston.middleware";
import i18n from "./config/i18n.config";
import cookieParser from "cookie-parser";
import upload from "./middleware/upload.middleware";
import s3 from "./config/s3.config";
import sharp from "sharp";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const bucketName = process.env.AWS_NAME;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173", // FE origin
    credentials: true,
  })
);
app.use(cookieParser());

app.use(i18n.init);
app.use(getLangFromHeader);
app.use(logRequestTime);

app.use("/api", routes);

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

app.post(
  "/upload",
  upload.single("image"),
  async (req: MulterRequest, res: Response) => {
    try {
      const file = req.file as Express.Multer.File | undefined;
      if (!file) {
        res.status(400).send("No file uploaded.");
        return;
      }

      // Resize ảnh với sharp, ví dụ resize width = 800 px
      const resizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 800 })
        .toBuffer();

      if (bucketName) {
        const params = {
          Bucket: bucketName,
          Key: `uploads/${Date.now()}-${file.originalname}`,
          Body: resizedImageBuffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        };

        console.log(params);

        const uploadResult = await s3.upload(params).promise();

        res.json({
          message: "Upload successful",
          url: uploadResult.Location,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading file");
    }
  }
);

app.post(
  "/upload-multi",
  upload.array("images", 5), // max 5 file, field name là 'images'
  async (req: MulterRequest, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        res.status(400).send("No files uploaded.");
        return;
      }

      const bucketName = process.env.AWS_NAME!;
      const uploadResults = [];

      // Xử lý tuần tự, bạn có thể chạy song song nếu muốn (Promise.all)
      for (const file of files) {
        const resizedBuffer = await sharp(file.buffer)
          .resize({ width: 800 })
          .toBuffer();

        const params = {
          Bucket: bucketName,
          Key: `uploads/${Date.now()}-${file.originalname}`,
          Body: resizedBuffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        };

        const uploadResult = await s3.upload(params).promise();
        uploadResults.push(uploadResult.Location);
      }

      res.json({
        message: "Upload successful",
        urls: uploadResults,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading files");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  connectDB();
});
