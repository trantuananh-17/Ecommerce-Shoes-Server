import { Router } from "express";
import sizeRouter from "./modules/size/size.routes";
import colorRouter from "./modules/color/color.routes";
import bannerRouter from "./modules/banned/banned.routes";
import categoryRouter from "./modules/category/category.routes";
import brandRouter from "./modules/brand/brand.routes";
import closureRouter from "./modules/closure/closure.routes";

const router = Router();

router.use("/banneds", bannerRouter);
router.use("/categories", categoryRouter);
router.use("/colors", colorRouter);
router.use("/sizes", sizeRouter);
router.use("/brands", brandRouter);
router.use("/closures", closureRouter);

export default router;
