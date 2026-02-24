/* ==========================================================================
   HTTP Error Classes
   ========================================================================== */

/**
 * Base class for all HTTP errors thrown in the service/repository layers.
 * Route handlers catch these and convert them into the standard response
 * envelope with the correct HTTP status code.
 */
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request") {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict") {
    super(409, message);
    this.name = "ConflictError";
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = "Unprocessable entity") {
    super(422, message);
    this.name = "UnprocessableEntityError";
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal server error") {
    super(500, message);
    this.name = "InternalServerError";
  }
}
