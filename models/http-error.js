class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // Add a 'message' property (error message)
        this.code = errorCode; // Adds a 'code' property (error status code)
    }
}

module.exports = HttpError;