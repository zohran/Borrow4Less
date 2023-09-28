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
const invest = async (
  ProfileId: string,
  InvestmentAmount: number,
  email: string
): Promise<void> => {
  // call debit wallet api for updating user's balance who has invested in the project
  let user;
  try {
    user = await userRepository.updateUserBalance(email, -InvestmentAmount);
  } catch (error) {
    return Promise.reject(error);
  }

  /**
   * TODO:
   * - We have to update the user's balance who has created the project.
   * - First we need to fetch the specified project with the projectId.
   * - Then we need to extract the profileId from the project document.
   * - Then we have to update user's balance with this profileId.
   */

  // create an record in table Investments_Transactions
  let investmentTransaction;

  try {
    investmentTransaction =
      await investmentsRepository.createInvestmentsTransaction({
        ProfileId,
        InvestmentAmount,
        /**
         * TODO:
         * - We must have to update the ProjectId with the actual id.
         */
        ProjectId: generateObjectId(), // Generate a unique ProjectId (should be updated later)
      });
  } catch (error) {
    // when we get an error then we have to rollback the user balance
    await userRepository.updateUserBalance(email, InvestmentAmount);
    return Promise.reject(error);
  }

  // Create a transaction record
  try {
    await transactionRepository.createTransaction(
      ProfileId,
      InvestmentAmount,
      "invest"
    );
  } catch (error) {
    // when we get an error then we have to rollback the user balance
    await userRepository.updateUserBalance(email, InvestmentAmount);

    // if we get an error then we have to delete the current Investment Transaction record
    await investmentsRepository.deleteInvestmentTransaction(
      "_id",
      investmentTransaction._id
    );
    return Promise.reject(error);
  }

  return Promise.resolve();
};

// Create an investmentsService object with the getInvestmentsTransactions function
const investmentsService = { getInvestmentsTransactions, invest };

// Export the investmentsService for use in other parts of your application
export default investmentsService;
