class ApiResponse<T> {
  statusCode: number;
  data: T | null; //data cna be any type  means array , obj etc
  message: string;
  success: boolean;
  constructor(statusCode: number, data: T | null, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    (this.message = message), (this.success = statusCode < 400);
  }
}
export { ApiResponse };
