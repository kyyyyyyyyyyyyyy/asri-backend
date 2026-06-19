import { writeLogAsync } from "./logger.js";

type ErrorLogPayload = {
  error?: unknown;
  context?: Record<string, unknown>;
};

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return error;
}

export function successResponse<T>(message: string, data?: T) {
  const response = {
    success: true,
    message,
    ...data
  };

  writeLogAsync({
    level: "info",
    event: "response:success",
    message,
    payload: {
      response
    }
  });

  return response;
}

export function errorResponse(message: string, logPayload?: ErrorLogPayload) {
  const response = {
    success: false,
    message
  };

  writeLogAsync({
    level: "error",
    event: "response:error",
    message,
    payload: {
      response,
      error: normalizeError(logPayload?.error),
      context: logPayload?.context
    }
  });

  return response;
}
