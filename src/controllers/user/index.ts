import { Request, Response } from "express";
import userRepository from "../../repositories/user";

// Define a function that retrieves a user's balance based on their email
export const getUserBalance = async (req: Request, res: Response) => {
  try {
    // Extract the userEmail from the request object
    const userEmail = req.userEmail!;

    // Find a user in the database with the given email
    const user = await userRepository.findUserByProperty("email", userEmail);

    // If a user was found, return their balance in the response
    return res.status(200).json({
      balance: user?.balance,
    });
  } catch (error) {
    // Handle errors here and respond with a 500 Internal Server Error
    res.status(500).json({ message: "Internal server error" });
  }
};
