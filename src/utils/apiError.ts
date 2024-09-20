class ApiError extends Error {
  statusCode: number;
  data: any | null; // Flexible data type
  success: boolean;
  errors: any[]; // Array to hold additional error details
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: [] = [],
    stacked: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;
    this.success = false;
    stacked
      ? (this.stack = stacked)
      : Error.captureStackTrace(this, this.constructor);
  }
}
export { ApiError };
