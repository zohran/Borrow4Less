import { Request, Response } from "express";
import transactionService from "../../services/transactions";
import userRepository from "../../repositories/user";
import transactionRepository from "../../repositories/transactions";

/**
 * Handles depositing funds into a user's account.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const deposit = async (req: Request, res: Response) => {
  try {
    // Extract the 'amount' and 'userEmail' from the request body and user object
    const amount = +req.body.amount;
    const userEmail = req.userEmail!;

    // Perform the deposit using the transactionService
    const { newTransaction, updatedUser } = await transactionService.deposit(
      userEmail,
      amount
    );

    // Respond with a success message, the new balance, and the transaction type
    return res.status(200).json({
      message: "Deposit successful!",
      newBalance: updatedUser?.balance,
      transactionType: newTransaction?.transactionType,
    });
  } catch (error) {
    console.log(error);
    // Handle errors here and respond with a 500 Internal Server Error
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Handles withdrawing funds from a user's account.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const withdraw = async (req: Request, res: Response) => {
  try {
    // Extract the 'amount' and 'userEmail' from the request body and user object
    const amount = +req.body.amount;
    const userEmail = req.userEmail!;

    // Find the user's balance
    const user = await userRepository.findUserByProperty("email", userEmail);

    // Check if the user has sufficient balance for withdrawal
    if ((user?.balance && user.balance < amount) || user?.balance == 0) {
      return res.status(400).json({
        message: "You do not have sufficient balance!",
        balance: user.balance,
      });
    }

    // Perform the withdrawal using the transactionService
    const { newTransaction, updatedUser } = await transactionService.withdraw(
      userEmail,
      amount
    );

    // Respond with a success message, the new balance, and the transaction type
    return res.status(200).json({
      message: "Withdraw successful!",
      newBalance: updatedUser?.balance,
      transactionType: newTransaction?.transactionType,
    });
  } catch (error) {
    // Handle errors here and respond with a 500 Internal Server Error
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Retrieves a list of all transactions associated with a user.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const getUserTransactionsList = async (req: Request, res: Response) => {
  try {
    // Extract the 'userId' from the request object
    const userId = req.userId!;

    // Find all transactions associated with the user and sort them by 'createdAt' in descending order
    const data = await transactionRepository.userTransactionList(userId);

    // Respond with the list of transactions
    return res.status(200).json({
      allTransactions: data,
    });
  } catch (error) {
    // Handle errors here and respond with a 500 Internal Server Error
    res.status(500).json({ message: "Internal server error" });
  }
};
