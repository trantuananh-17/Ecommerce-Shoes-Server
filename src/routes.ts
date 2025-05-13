import { Router } from "express";
import sizeRouter from "./modules/size/size.routes";
import colorRouter from "./modules/color/routes/color.routes";
import bannerRouter from "./modules/banned/banned.routes";

const router = Router();

router.use("/sizes", sizeRouter);
router.use("/colors", colorRouter);
router.use("/banners", bannerRouter);

export default router;
