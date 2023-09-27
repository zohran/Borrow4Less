import jwt from "jsonwebtoken";

/**
 * Checks if a JWT token is valid or not.
 *
 * @param token - The JWT token to validate.
 * @returns True if the token is valid; otherwise, false.
 */
export function isValidToken(token: string): boolean {
  try {
    const decodedToken: any = jwt.decode(token); // Decode the token

    // If the token cannot be decoded or does not have an expiration time, consider it as invalid
    if (!decodedToken || !decodedToken.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds

    // Check if the token's expiration time is greater than the current time (not expired)
    return decodedToken.exp > currentTime;
  } catch (error) {
    // If there's an error while decoding, consider the token as expired
    return false;
  }
}
