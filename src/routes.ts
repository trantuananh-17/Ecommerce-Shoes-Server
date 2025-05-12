import { Router } from "express";
import sizeRouter from "./modules/size/size.routes";
import colorRouter from "./modules/color/routes/color.routes";

const router = Router();

router.use("/sizes", sizeRouter);
router.use("/colors", colorRouter);

export default router;
