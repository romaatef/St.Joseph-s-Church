type AuthSessionError = {
  code?: string;
};

const INVALID_REFRESH_TOKEN_CODES = new Set([
  "refresh_token_not_found",
  "refresh_token_already_used",
  "session_expired",
]);

export function isInvalidRefreshTokenError(
  error: AuthSessionError | null | undefined,
): boolean {
  return Boolean(error?.code && INVALID_REFRESH_TOKEN_CODES.has(error.code));
}
