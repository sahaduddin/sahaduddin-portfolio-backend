class ApiResponse {
  constructor(success, data = null, message = '', statusCode = 200) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  static success(data = null, message = 'Success', statusCode = 200) {
    return new ApiResponse(true, data, message, statusCode);
  }

  static error(message = 'Error', statusCode = 500, data = null) {
    return new ApiResponse(false, data, message, statusCode);
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      data: this.data,
      message: this.message,
      timestamp: this.timestamp
    });
  }
}

module.exports = ApiResponse;
