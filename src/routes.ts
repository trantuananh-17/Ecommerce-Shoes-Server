import { Router } from "express";
import sizeRouter from "./modules/size/size.routes";
import colorRouter from "./modules/color/color.routes";
import bannerRouter from "./modules/banned/banned.routes";
import categoryRouter from "./modules/category/category.routes";
import brandRouter from "./modules/brand/brand.routes";
import closureRouter from "./modules/closure/closure.routes";
import materialRouter from "./modules/material/material.routes";
import discountRouter from "./modules/discount/discount.routes";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";
import productRouter from "./modules/product/product.routes";
import eventRouter from "./modules/event/event.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/banneds", bannerRouter);
router.use("/categories", categoryRouter);
router.use("/colors", colorRouter);
router.use("/sizes", sizeRouter);
router.use("/brands", brandRouter);
router.use("/closures", closureRouter);
router.use("/materials", materialRouter);
router.use("/discounts", discountRouter);
router.use("/products", productRouter);
router.use("/events", eventRouter);

export default router;
