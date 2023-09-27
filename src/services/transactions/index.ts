import { ITransaction } from "../../models/Transaction";
import { IUser } from "../../models/User";
import transactionRepository from "../../repositories/transactions";
import userRepository from "../../repositories/user";

/**
 * Deposit money into a user's account.
 *
 * @param email - The user's email.
 * @param amount - The amount to deposit.
 * @returns A Promise containing the updated user and the new transaction.
 */
const deposit = async (
  email: string,
  amount: number
): Promise<{
  updatedUser: IUser | null;
  newTransaction: ITransaction | null;
}> => {
  // Update the user's balance by incrementing it with the specified 'amount'
  const updatedUser: IUser | null = await userRepository.updateUserBalance(
    email,
    amount
  );

  // Create a new transaction record for the deposit
  const newTransaction: ITransaction | null =
    await transactionRepository.createTransaction(
      updatedUser?._id,
      amount,
      "deposit"
    );

  return { updatedUser, newTransaction };
};

/**
 * Withdraw money from a user's account.
 *
 * @param email - The user's email.
 * @param amount - The amount to withdraw.
 * @returns A Promise containing the updated user and the new transaction.
 */
const withdraw = async (
  email: string,
  amount: number
): Promise<{
  updatedUser: IUser | null;
  newTransaction: ITransaction | null;
}> => {
  // Update the user's balance by decrementing it with the specified 'amount'
  const updatedUser: IUser | null = await userRepository.updateUserBalance(
    email,
    -amount
  );

  // Create a new transaction record for the withdrawal
  const newTransaction: ITransaction | null =
    await transactionRepository.createTransaction(
      updatedUser?._id,
      amount,
      "withdraw"
    );

  return { updatedUser, newTransaction };
};

// Combine the deposit and withdraw functions into a transactionService object
const transactionService = { deposit, withdraw };

export default transactionService;
