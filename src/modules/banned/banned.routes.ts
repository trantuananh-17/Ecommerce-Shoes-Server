import { Router } from "express";
import { BannerController } from "./banned.controller";

const bannerRouter = Router();
const controller = new BannerController();

bannerRouter.get("/", controller.getAllBannedWordController);
bannerRouter.get("/all", controller.getAllBannedWordWithPaginationController);
bannerRouter.post("/", controller.createBannedController);
bannerRouter.delete("/:id", controller.deleteBannedWordController);

export default bannerRouter;
