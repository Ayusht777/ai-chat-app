import { ApiError } from "./apiError.js";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const validator = (fullName: string, email: string, password: string): boolean => {
  if (fullName.length < 3 || fullName.length > 50) {
    throw new ApiError(
      411,
      "Full name must be between 3 and 50 characters long"
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new ApiError(406, "Invalid email format");
  }

  if (password.length < 8) {
    throw new ApiError(411, "Password must be at least 8 characters long");
  }

  if (!PASSWORD_REGEX.test(password)) {
    throw new ApiError(
      406,
      "Password must contain at least one uppercase letter, one number, and one special character"
    );
  }
  return true;
};

export default validator;
