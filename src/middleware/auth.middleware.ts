import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
const verifyToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      if (!accessToken) {
        throw new ApiError(404, "No access token found in cookies or headers");
      }
      const decodedAccessTokenPayLoad = await jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      if (!decodedAccessTokenPayLoad) {
        throw new ApiError(404, "Invalid access token");
      }
      const user = await User.findById({
        _id: decodedAccessTokenPayLoad._id,
      }).select("-password -refreshToken -__v");
      /*{
        _id: '66ed808bfc5b7dee0219ae4d',
        fullName: 'ayush',
        email: 'ayush@mail.com',
        role: 'user',
        iat: 1726915037,
        exp: 1727001437
        }*/
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(500, error?.message || "Internal Server Error");
    }
  }
);

export { verifyToken };
