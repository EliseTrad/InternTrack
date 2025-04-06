// customErrors.js
class UserNotFoundError extends Error {
  constructor() {
    super("User not found.");
    this.name = 'UserNotFoundError';
    this.statusCode = 404;
  }
}

class UserConflictError extends Error {
  constructor() {
    super("User is referenced in other records and can't be deleted");
    this.name = "UserConflictError";
    this.statusCode = 409;
  }
}

class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Email already exists.");
    this.name = 'EmailAlreadyExistsError';
    this.statusCode = 409;
  }
}

class NameAlreadyExistsError extends Error {
  constructor() {
    super("Name already exists.");
    this.name = 'NameAlreadyExistsError';
    this.statusCode = 409;
  }
}

class InvalidPassword extends Error {
  constructor() {
    super("Invalid password. Please try again.");
    this.name = 'InvalidPassword';
    this.statusCode = 401;
  }
}

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFound";
    this.statusCode = 404;
  }
}

module.exports = {
  UserNotFoundError,
  EmailAlreadyExistsError,
  NameAlreadyExistsError,
  UserConflictError,
  InvalidPassword,
  NotFound
};
