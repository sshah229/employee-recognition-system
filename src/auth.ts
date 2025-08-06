
export type User = {
  id: string;
  role: 'USER' | 'ADMIN';
};

/**
 * Stub for extracting user info from an authorization header.
 * Replace with real JWT decoding in production.
 */
export function getUserFromToken(authHeader?: string): User {
  if (authHeader === 'admin-token') {
    return { id: 'admin', role: 'ADMIN' };
  }
  // default to a normal user; you might parse a Bearer token here
  return { id: authHeader ?? 'user1', role: 'USER' };
}
