import jwt from "jsonwebtoken";

/**
 * Generates a JWT token for user authentication.
 *
 * @param _id - The user's ID.
 * @param name - The user's name.
 * @param email - The user's email.
 * @returns A JWT token string.
 */
const generateToken = (_id: string, name: string, email: string): string => {
  // Generate a JWT token for user authentication
  const token = jwt.sign(
    {
      userId: _id,
      name: name,
      email: email,
    },
    process.env.JWT_SECRET || "", // Your JWT secret key
    {
      expiresIn: process.env.JWT_EXPIRES, // Token expiration time (adjust as needed)
    }
  );

  return token;
};

export default generateToken;
