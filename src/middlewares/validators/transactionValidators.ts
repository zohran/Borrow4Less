import { NextFunction, Request, Response } from "express";

// Define a middleware function for validating deposit or withdrawal amounts
export const depositOrWithdrawValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the 'amount' from the request body and cast it to a number
  const amount = +req.body.amount;

  // Create an 'error' object to store validation errors
  const error: { amount?: string } = {};

  // Check if 'amount' is not greater than 0 or if it's NaN (Not-a-Number)
  if (!(amount > 0) || Number.isNaN(amount)) {
    // If 'amount' is invalid, set an error message
    error.amount = "Invalid amount!";
  }

  // Check if there are any validation errors
  if (error.amount) {
    // If there are validation errors, return a 400 Bad Request response
    // with a message and the 'error' object containing validation details
    return res.status(400).json({
      message: "Invalid credentials!",
      error,
    });
  }

  // If there are no validation errors, call the 'next' function to continue processing
  next();
};
