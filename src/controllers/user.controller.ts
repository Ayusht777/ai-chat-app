import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import validator from "../utils/validator.js";

const optionsForAccessTokenCookie = {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24,
};
const optionsForRefreshTokenCookie = {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24 * 7,
};
const generateAccessTokenAndRefreshToken = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("Pass userId as a parameter to the function");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(500, "User not found while generating tokens");
    }
    const { accessToken, refreshToken } = await user.generateAuthTokens();

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};
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
  const isValidate = validator(email, password, fullName);
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
  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "user created successfully"));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  //get email password from body
  //validate it
  //check user existed in db
  //than check password enter and on db\
  //if so then generate access token  and refresh token
  //set this into cookies
  // send response
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All Felids required");
  }

  const validate = validator(email, password);
  if (!validate) {
    throw new ApiError(412, "validation failed for input fields");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User Not Found on DB");
  }
  const validatePassword = await user.verifyPassword(password);
  if (!validatePassword) {
    throw new ApiError(401, "Password Does not Matched");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Token not generated");
  }
  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // we removed the token so for token rotation
  if (!loginUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, optionsForAccessTokenCookie)
    .cookie("refreshToken", refreshToken, optionsForRefreshTokenCookie)
    .json(
      new ApiResponse(
        201,
        { user: loginUser, accessToken, refreshToken }, //sending token in response because some device not support cookie or not allow cookie
        "user login successfully"
      )
    );
});
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  //get user id from req.user
  //match user id with db
  //if user id matched then remove refresh token in DB and cookies
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(404, "user not found");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "user logout successfully"));
});



export { registerUser, loginUser, logoutUser };
