import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.route.js";
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
//routes middleware
app.use("/api/v1", router);
export { app };
