import { Router } from "express";
import userRouter from "./user.route.js";
import chatRouter from "./chat.route.js";

const router = Router();

router.use("/users", userRouter);
router.use("/chat", chatRouter);

export default router;
