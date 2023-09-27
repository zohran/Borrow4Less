import { NextFunction, Request, Response } from "express";

/**
 * Middleware function to validate the request body for an investment transaction.
 * It checks if the provided ProfileId, InvestmentAmount, and ProjectId are valid.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const investmentTransactionValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Destructure the request body
  let { ProfileId, InvestmentAmount, ProjectId } = req.body;

  // Convert InvestmentAmount to a number
  InvestmentAmount = +InvestmentAmount;

  // Initialize an error object to store validation errors
  const error: {
    ProfileId?: string;
    InvestmentAmount?: string;
    ProjectId?: string;
  } = {};

  // Validate ProfileId
  if (!ProfileId || typeof ProfileId !== "string") {
    error.ProfileId = "Invalid ProfileId";
  }

  // Validate InvestmentAmount
  if (!InvestmentAmount || Number.isNaN(InvestmentAmount)) {
    error.InvestmentAmount = "Invalid InvestmentAmount";
  }

  // Validate ProjectId
  if (!ProjectId || typeof ProjectId !== "string") {
    error.ProjectId = "Invalid ProjectId";
  }

  // If there are validation errors, respond with a 400 Bad Request status and error messages
  if (Object.keys(error).length > 0) {
    return res.status(400).json({
      message: "Invalid credentials!",
      error,
    });
  }

  // If no validation errors are found, continue to the next middleware or route handler
  next();
};

/**
 * Middleware for validating query parameters when fetching investment transactions.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const getInvestmentsTransactionsValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract query parameters from the request
  const ProfileId = req.query.ProfileId as string;
  const TransactionPeriod = req.query.TransactionPeriod as string | undefined;

  // Define an error object to store validation errors
  const error: { ProfileId?: string; TransactionPeriod?: string } = {};

  // Validate ProfileId
  if (!ProfileId || typeof ProfileId !== "string") {
    error.ProfileId = "Invalid ProfileId";
  }

  // Validate TransactionPeriod if provided
  if (TransactionPeriod) {
    // Define a regular expression pattern to match the expected format (Xdays or Xyear)
    const pattern = /^(\d+)\s*(days|year)$/i;

    // Use regex pattern to match the input
    const match = TransactionPeriod.match(pattern);

    // If there is no match, it's an invalid TransactionPeriod
    if (!match) {
      error.TransactionPeriod = "Invalid TransactionPeriod";
    }
  }

  // If there are validation errors, respond with a 400 Bad Request status
  if (Object.keys(error).length > 0) {
    return res.status(400).json({ message: "Invalid Credentials!", error });
  }

  // If validation passes, continue to the next middleware
  next();
};
