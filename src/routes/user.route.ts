import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/user.controller.js";

const userRouter = Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.use(verifyToken).get("/logout", logoutUser);
export default userRouter;
