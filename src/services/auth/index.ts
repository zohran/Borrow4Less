import bcrypt from "bcrypt";
import { IUser } from "../../models/User";
import userRepository from "../../repositories/user";
import generateToken from "../../utils/generateToken";

/**
 * Register a new user.
 *
 * @param name - The user's name.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns An object containing the new user and a JWT token.
 */
const register = async (
  name: string,
  email: string,
  password: string
): Promise<{ newUser: IUser; token: string }> => {
  // Hash the user's password for storage
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create a new user in the database with the hashed password
  const newUser = await userRepository.createNewUser({
    name,
    email,
    password: hashedPassword,
  });

  // Generate a JWT token for user authentication
  const token = generateToken(newUser._id, newUser.name, newUser.email);

  return { newUser, token };
};

/**
 * Log in a user.
 *
 * @param _id - The user's ID.
 * @param name - The user's name.
 * @param email - The user's email.
 * @param password - The user's password to check.
 * @param hashPassword - The hashed password stored in the database.
 * @returns An object indicating whether the password matches and, if so, a JWT token.
 */
const login = async (
  _id: string,
  name: string,
  email: string,
  password: string,
  hashPassword: string
) => {
  // Compare the provided password with the hashed password stored in the database
  const isMatchPassword = await bcrypt.compare(password, hashPassword);

  let token;
  if (isMatchPassword) {
    // Generate a JWT token if the password matches
    token = generateToken(_id, name, email);

    return { isMatchPassword, token };
  } else {
    return { isMatchPassword };
  }
};

// Combine the register and login functions into an authService object
const authService = { register, login };

export default authService;
