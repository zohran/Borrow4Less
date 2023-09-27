import { Request, Response } from "express";
import investmentsRepository from "../../repositories/investments";
import transactionRepository from "../../repositories/transactions";
import userRepository from "../../repositories/user";
import generateObjectId from "../../utils/generateObjectId";
import investmentsService from "../../services/investments/indext";

/**
 * Endpoint for handling investment transactions.
 * This function performs the following steps:
 * 1. Checks if the user has sufficient balance.
 * 2. Creates an investment transaction.
 * 3. Updates the user's balance.
 * 4. Creates a transaction record.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const invest = async (req: Request, res: Response) => {
  const { ProfileId, InvestmentAmount, ProjectId } = req.body;

  try {
    // Get user balance and email from request userInfo
    const { balance, email } = req.userInfo!;

    // Check if the user has enough balance for the investment
    if (balance == 0 || balance < InvestmentAmount) {
      return res
        .status(200)
        .json({ message: "You do not have enough balance!" });
    }

    // call the investment service to invest
    await investmentsService.invest(ProfileId, InvestmentAmount, email);

    // Respond with a 201 Created status and a success message
    return res.status(201).json({ message: "Investment successful!" });
  } catch (error) {
    // Handle errors here and respond with a 500 Internal Server Error
    res.status(500).json({ message: "Internal server error!" });
  }
};

/**
 * Endpoint for fetching investment transactions of a user.
 * This function performs the following steps:
 * 1. Extracts query parameters from the request.
 * 2. Calls the investmentsService to retrieve investment transactions.
 * 3. Responds with the retrieved data or handles errors.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getInvestmentTransactionsOfAUser = async (
  req: Request,
  res: Response
) => {
  // Extract query parameters from the request
  const ProfileId = req.query.ProfileId as string;
  const TransactionType = req.query.TransactionType as string | undefined;
  const TransactionPeriod = req.query.TransactionPeriod as string | undefined;
  const keywords = req.query.keywords as string | undefined;

  try {
    // Call the investmentsService to fetch investment transactions based on parameters
    const data = await investmentsService.getInvestmentsTransactions(
      ProfileId,
      TransactionType,
      TransactionPeriod,
      keywords
    );

    // Respond with a 200 OK status and the retrieved data
    res.status(200).json(data);
  } catch (error) {
    // Handle errors here and respond with a 500 Internal Server Error
    res.status(500).json({ message: "Internal server error!" });
  }
};
