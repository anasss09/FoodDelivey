class ErrorHandler extends Error {
    constructor(statusCode, message = 'Error is here', errors=[], stack) {
        super(message)
        this.statusCode = statusCode,
        this.message = message,
        this.errors = errors,
        this.stack = stack,
        this.success = false
    }
}

export default ErrorHandler;