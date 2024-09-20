import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "ChatMessages",
      },
    ],
    role: {
      type: String,
      enum: ["user", "guest"],
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  return next();
});
userSchema.methods.verifyPassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1d" }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
};

userSchema.virtual("name").get(function () {
  return this.fullName;
});
// When you access user.name, it will return the value of user.fullName.
// This provides flexibility in your code without adding an extra field to your database schema.
export const User = model("User", userSchema);
