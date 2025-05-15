import { Router } from "express";
import sizeRouter from "./modules/size/size.routes";
import colorRouter from "./modules/color/routes/color.routes";
import bannerRouter from "./modules/banned/banned.routes";
import categoryRouter from "./modules/category/category.routes";

const router = Router();

router.use("/banners", bannerRouter);
router.use("/categories", categoryRouter);
router.use("/colors", colorRouter);
router.use("/sizes", sizeRouter);

export default router;
