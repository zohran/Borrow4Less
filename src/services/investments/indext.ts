import investmentsRepository from "../../repositories/investments";
import transactionRepository from "../../repositories/transactions";
import userRepository from "../../repositories/user";
import generateObjectId from "../../utils/generateObjectId";

/**
 * Service function to get investment transactions based on various filters.
 * This function acts as an intermediary between the controller and the repository.
 * @param {string} ProfileId - The user's profile ID.
 * @param {string | undefined} TransactionType - Optional transaction type.
 * @param {string | undefined} TransactionPeriod - Optional transaction period.
 * @param {string | undefined} keywords - Optional keywords for filtering.
 * @returns {Promise<any>} - A promise that resolves with the retrieved data.
 */
const getInvestmentsTransactions = async (
  ProfileId: string,
  TransactionType: string | undefined,
  TransactionPeriod: string | undefined,
  keywords: string | undefined
) => {
  let TransactionPeriodInDays;

  // Check if TransactionPeriod is provided and convert it to days if needed
  if (TransactionPeriod) {
    if (TransactionPeriod.includes("days")) {
      TransactionPeriodInDays = +TransactionPeriod.split("days")[0];
    } else if (TransactionPeriod.includes("year")) {
      // Convert the "year" format to days (assuming 1 year = 365 days)
      TransactionPeriodInDays = +TransactionPeriod.split("year")[0] * 365;
    }
  }

  // Call the getInvestmentsTransactions function from the investmentsRepository
  return investmentsRepository.getInvestmentsTransactions(
    ProfileId,
    TransactionType,
    TransactionPeriodInDays,
    keywords
  );
};

/**
 * Handle an investment operation, including creating an investment transaction,
 * updating the user's balance, and creating a transaction record.
 *
 * @param {string} ProfileId - The profile ID associated with the investment.
 * @param {number} InvestmentAmount - The amount of the investment.
 * @param {string} email - The user's email for balance update.
 * @returns {Promise<void>} A promise that resolves when all operations are completed.
 */
const invest = (ProfileId: string, InvestmentAmount: number, email: string) => {
  // Create an array to store promises for each operation
  const promises = [];

  // Create an investment transaction and push the promise onto the array
  promises.push(
    investmentsRepository.createInvestmentsTransaction({
      ProfileId,
      InvestmentAmount,
      ProjectId: generateObjectId(), // Generate a unique ProjectId (should be updated later)
    })
  );

  // Update the user's balance by deducting the investment amount and push the promise onto the array
  promises.push(userRepository.updateUserBalance(email, -InvestmentAmount));

  // Create a transaction record and push the promise onto the array
  promises.push(
    transactionRepository.createTransaction(
      ProfileId,
      InvestmentAmount,
      "invest"
    )
  );

  // Return a single promise that resolves when all promises in the array have resolved
  return Promise.all(promises);
};

// Create an investmentsService object with the getInvestmentsTransactions function
const investmentsService = { getInvestmentsTransactions, invest };

// Export the investmentsService for use in other parts of your application
export default investmentsService;
