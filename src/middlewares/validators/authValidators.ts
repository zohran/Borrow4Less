import { NextFunction, Request, Response } from "express";
import isValidEmail from "../../utils/isValidEmail"; // Import the isValidEmail function if not already defined

// Define an interface for validation errors
interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

// Middleware for validating user registration data
export const registerValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Destructure data from the request body
  const { name, email, password } = req.body;

  // Create an 'error' object to store validation errors
  const error: Errors = {};

  // Validate the 'name' field
  if (!name || typeof name !== "string" || name.length < 6) {
    error.name = "Name must be at least 6 characters!";
  }

  // Validate the 'email' field using the isValidEmail function
  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    error.email = "Invalid email!";
  }

  // Validate the 'password' field
  if (!password || typeof password !== "string") {
    error.password = "Invalid password!";
  }

  // Check if there are any validation errors
  if (Object.keys(error).length > 0) {
    // If there are validation errors, return a 400 Bad Request response
    // with a message and the 'error' object containing validation details
    return res.status(400).json({
      message: "Invalid credentials!",
      error,
    });
  }

  // If there are no validation errors, call the 'next' function to proceed to the next middleware
  next();
};

// Middleware for validating user login data
export const loginValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Destructure data from the request body
  const { email, password } = req.body;

  // Create an 'error' object to store validation errors
  const error: Errors = {};

  // Validate the 'email' field using the isValidEmail function
  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    error.email = "Invalid email!";
  }

  // Validate the 'password' field
  if (!password || typeof password !== "string") {
    error.password = "Invalid password!";
  }

  // Check if there are any validation errors
  if (Object.keys(error).length > 0) {
    // If there are validation errors, return a 400 Bad Request response
    // with a message and the 'error' object containing validation details
    return res.status(400).json({
      message: "Invalid credentials!",
      error,
    });
  }

  // If there are no validation errors, call the 'next' function to proceed to the next middleware
  next();
};
