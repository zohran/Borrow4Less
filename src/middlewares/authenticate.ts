import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { isValidToken } from "../utils/isValidToken";
import userRepository from "../repositories/user";
import { IUser } from "../models/User";

// Extend the Express Request interface to include userEmail and userID
declare global {
  namespace Express {
    interface Request {
      userEmail?: string;
      userId?: string;
      userInfo?: IUser;
    }
  }
}

// Middleware for authenticating requests
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the token from the 'Authorization' header
  const token = req.headers.authorization?.split(" ")[1];

  // If there's no token, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: "Authorization failed!" });
  }

  try {
    // Check if the token is valid (you can replace this with your own logic)
    const isValid = isValidToken(token);

    if (!isValid) {
      // Token is expired, return a 401 Unauthorized response
      return res.status(401).json({ message: "Token is expired!" });
    }

    // Verify the token using the JWT_SECRET (or an empty string if not defined)
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || "");

    // Check if user exist with the email from decoded token
    const user = await userRepository.findUserByProperty(
      "email",
      decodedToken.email
    );

    if (!user?.name) {
      return res.status(401).json({ message: "Invalid Token!" });
    }

    // If the token is valid, store the user's email and id in the request object
    req.userEmail = decodedToken.email;
    req.userId = decodedToken.userId;
    req.userInfo = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);
    // Handle errors here, e.g., if the token is invalid or there's an internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};
