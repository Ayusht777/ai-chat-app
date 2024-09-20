import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import validator from "../utils/validator.js";
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  //take fullName, email.password in body
  //check for validations
  //check if same email exited
  //create user based role on user
  //save this on db
  //remove password refresh token remove
  const { fullName, email, password } = req.body;

  if (
    [fullName, email, password].some((inputFields) => inputFields.trim() === "")
  ) {
    throw new ApiError(400, "All Fields required");
  }
  const isValidate = validator(fullName, email, password);
  if (!isValidate) {
    throw new ApiError(412, "validation failed for input fields");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }
  const user = await User.create({
    fullName: fullName.toLowerCase(),
    email,
    password,
    role: "user",
  });
  if (!user) {
    throw new ApiError(500, "Failed to create user. Please try again.");
  }
  const newUser = await User.findById(user._id).select(
    "-password -refreshToken -__v"
  );
  if (!newUser) {
    throw new ApiError(400, "user was not created");
  }
  return res.status(201).json(new ApiResponse(201, newUser, "user created"));
});

export { registerUser };
