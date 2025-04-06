// customErrors.js
/**
 * Custom error classes for handling specific error scenarios.
 * Each class extends the native Error class and includes a custom message,
 * name, and HTTP status code for better error handling and response formatting.
 */

/**
 * Represents an error when a user is referenced in other records and cannot be deleted.
 * Status Code: 409 (Conflict)
 */
class UserConflictError extends Error {
  constructor() {
    super("The user is referenced in other records and cannot be deleted."); // Standardized message
    this.name = "UserConflictError"; // Name of the error
    this.statusCode = 409; // HTTP status code for conflict errors
  }
}

/**
 * Represents an error when an email already exists in the database.
 * Status Code: 409 (Conflict)
 */
class EmailAlreadyExistsError extends Error {
  constructor() {
    super("The provided email already exists in the system."); // Standardized message
    this.name = 'EmailAlreadyExistsError'; // Name of the error
    this.statusCode = 409; // HTTP status code for conflict errors
  }
}

/**
 * Represents an error when a name already exists in the database.
 * Status Code: 409 (Conflict)
 */
class NameAlreadyExistsError extends Error {
  constructor() {
    super("The provided name already exists in the system."); // Standardized message
    this.name = 'NameAlreadyExistsError'; // Name of the error
    this.statusCode = 409; // HTTP status code for conflict errors
  }
}

/**
 * Represents an error when an invalid password is provided during authentication.
 * Status Code: 401 (Unauthorized)
 */
class InvalidPassword extends Error {
  constructor() {
    super("The provided password is invalid. Please try again."); // Standardized message
    this.name = 'InvalidPassword'; // Name of the error
    this.statusCode = 401; // HTTP status code for unauthorized errors
  }
}

/**
 * Represents an error when a requested resource is not found.
 * Status Code: 404 (Not Found)
 */
class NotFound extends Error {
  /**
   * @param {string} message - A custom message describing the not-found error.
   */
  constructor(message) {
    super(message || "The requested resource was not found."); // Default or custom message
    this.name = "NotFound"; // Name of the error
    this.statusCode = 404; // HTTP status code for not-found errors
  }
}

// Export all custom error classes for use in the application
module.exports = {
  EmailAlreadyExistsError,
  NameAlreadyExistsError,
  UserConflictError,
  InvalidPassword,
  NotFound,
};