import investmentsRepository from "../../repositories/investments";

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

// Create an investmentsService object with the getInvestmentsTransactions function
const investmentsService = { getInvestmentsTransactions };

// Export the investmentsService for use in other parts of your application
export default investmentsService;
