/** Typed application errors mapped to HTTP responses by the route wrapper. */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const unauthorized = (msg = "authentication required") => new AppError(401, "UNAUTHORIZED", msg);
export const forbidden = (msg = "forbidden") => new AppError(403, "FORBIDDEN", msg);
export const notFound = (msg = "not found") => new AppError(404, "NOT_FOUND", msg);
export const conflict = (msg: string) => new AppError(409, "CONFLICT", msg);
export const gone = (msg: string) => new AppError(410, "GONE", msg);
export const unprocessable = (msg: string, details?: unknown) => new AppError(422, "INVALID", msg, details);
export const tooMany = (msg = "rate limit exceeded") => new AppError(429, "RATE_LIMITED", msg);

/** Postgres unique_violation. */
export function isUniqueViolation(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "23505";
}
