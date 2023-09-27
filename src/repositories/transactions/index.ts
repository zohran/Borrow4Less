import Transaction, { ITransaction } from "../../models/Transaction";

/**
 * Create a new transaction record.
 *
 * @param userId - The user ID associated with the transaction.
 * @param amount - The transaction amount.
 * @param transactionType - The type of transaction (e.g., 'deposit', 'withdraw').
 * @returns A Promise that resolves to the created transaction record.
 */
const createTransaction = async (
  userId: string,
  amount: number,
  transactionType: string
): Promise<ITransaction | null> => {
  // Create a new transaction record
  return Transaction.create({
    user: userId,
    amount,
    transactionType,
  });
};

/**
 * Retrieve a list of transactions associated with a user.
 *
 * @param userId - The user ID for which to retrieve transactions.
 * @returns A Promise that resolves to an array of transaction records.
 */
const userTransactionList = async (userId: string): Promise<ITransaction[]> => {
  // Find all transactions associated with the user and sort them by 'createdAt' in descending order
  return Transaction.find({ user: userId }).sort({
    createdAt: -1,
  });
};

// Combine the createTransaction and userTransactionList functions into a transactionRepository object
const transactionRepository = { createTransaction, userTransactionList };

export default transactionRepository;
