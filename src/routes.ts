import { Router } from "express";
import sizeRouter from "./modules/size/size.routes";

const router = Router();

router.use("/sizes", sizeRouter);

export default router;
