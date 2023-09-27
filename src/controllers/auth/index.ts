import cookie from "cookie";
import { Request, Response } from "express";
import { IUser } from "../../models/User";
import userRepository from "../../repositories/user";
import authService from "../../services/auth";

/**
 * Handles user registration.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const register = async (req: Request, res: Response) => {
  try {
    // Extract user registration data from the request body
    const { name, email, password } = req.body;

    // Check if a user with the provided email already exists
    const userWithEmail: IUser | null = await userRepository.findUserByProperty(
      "email",
      email
    );

    // If a user with the same email exists, return a conflict response
    if (userWithEmail?.name) {
      return res.status(409).json({
        message: "User already exists with this email!",
      });
    }

    // Register the user and get user data and token from the authService
    const { newUser, token } = await authService.register(
      name,
      email,
      password
    );

    // Set the JWT token as a cookie in the response
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true, // Cookie can only be accessed via HTTP(S) requests
        secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
        maxAge: 60 * 24 * 60 * 60 * 1000, // Token cookie expiration time in milliseconds (adjust as needed)
        sameSite: "strict", // Helps prevent cross-site request forgery (CSRF) attacks
        path: "/", // Cookie is accessible from the root path
      })
    );

    // Respond with a success message and user data
    res.status(201).json({
      message: "User registered successfully!",
      data: {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        accessToken: token,
      },
    });
  } catch (error) {
    // Handle errors here and respond with a 500 Internal Server Error
    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * Handles user login.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Extract user login data from the request body
    const { email, password } = req.body;

    // Find a user with the provided email in the database
    const user: IUser | null = await userRepository.findUserByProperty(
      "email",
      email
    );

    // Check if a user with the provided email exists
    if (!user?.name) {
      // Return a 400 Bad Request response if the user does not exist
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid credentials!",
      });
    }

    // Attempt to log in using the authService
    const { isMatchPassword, token } = await authService.login(
      user._id,
      user.name,
      user.email,
      password,
      user.password
    );

    // Check if the password was correct
    if (!isMatchPassword) {
      // Return a 401 Unauthorized response if the password is incorrect
      return res.status(400).json({
        message: "Invalid credentials!",
      });
    }

    // Set the JWT token as a cookie in the response
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true, // Cookie can only be accessed via HTTP(S) requests
        secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
        maxAge: 60 * 24 * 60 * 60 * 1000, // Token cookie expiration time in milliseconds (adjust as needed)
        sameSite: "strict", // Helps prevent cross-site request forgery (CSRF) attacks
        path: "/", // Cookie is accessible from the root path
      })
    );

    // Return a 200 OK response with the success message and token
    return res.status(200).json({
      message: "Login successful",
      data: {
        accessToken: token,
      },
    });
  } catch (error) {
    // Handle errors here and respond with a 500 Internal Server Error
    res.status(500).json({ message: "Internal server error" });
  }
};
