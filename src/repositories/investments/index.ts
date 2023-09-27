import mongoose from "mongoose";
import Investments_Transaction, {
  I_Investments_Transaction,
} from "../../models/Investments_Transaction";

/**
 * Function to create a new investments transaction.
 * @param {Object} params - Object containing ProfileId, InvestmentAmount, and ProjectId.
 * @returns {Promise<I_Investments_Transaction>} - A promise that resolves with the saved transaction document.
 */
const createInvestmentsTransaction = async ({
  ProfileId,
  InvestmentAmount,
  ProjectId,
}: {
  ProfileId: string;
  InvestmentAmount: number;
  ProjectId: string;
}): Promise<I_Investments_Transaction> => {
  // Create a new Investments_Transaction document
  const investmentsTransaction = new Investments_Transaction({
    ProfileId,
    InvestmentAmount,
    ProjectId,
  });

  // Save the document to the database and return the saved document
  return investmentsTransaction.save();
};

/**
 * Function to get investments transactions with optional filters.
 * @param {string} ProfileId - The user's profile ID.
 * @param {string | undefined} TransactionType - Optional transaction type.
 * @param {number | undefined} TransactionPeriodInDays - Optional transaction period in days.
 * @param {string | undefined} keywords - Optional keywords for filtering.
 * @returns {Promise<any>} - A promise that resolves with the filtered investment transactions.
 */
const getInvestmentsTransactions = async (
  ProfileId: string,
  TransactionType: string | undefined,
  TransactionPeriodInDays: number | undefined,
  keywords: string | undefined
) => {
  // Initialize the aggregation pipeline with a $match stage to filter by ProfileId
  const pipeline: any[] = [
    {
      $match: {
        ProfileId: { $eq: new mongoose.Types.ObjectId(ProfileId) },
      },
    },
  ];

  // Add a $match stage to filter by TransactionPeriodInDays if provided
  if (TransactionPeriodInDays) {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - TransactionPeriodInDays);

    pipeline.push({
      $match: {
        createdAt: { $gte: startDate, $lte: currentDate },
      },
    });
  }

  // Check if keywords (search term) are provided for filtering
  if (keywords) {
    // Add a $lookup stage to join with the "Projects" collection
    pipeline.push(
      {
        $lookup: {
          from: "Projects",
          localField: "ProjectId",
          foreignField: "_id",
          as: "projectInfo",
        },
      },
      {
        $unwind: "$projectInfo",
      },
      {
        // Add a $addFields stage to calculate isMatching based on the search term
        $addFields: {
          isMatching: {
            $cond: {
              if: {
                $regexMatch: {
                  input: "$projectInfo.projectTitle",
                  regex: keywords,
                  options: "i", // Case-insensitive search
                },
              },
              then: true, // If there's a match, set isMatching to true
              else: false, // Otherwise, set isMatching to false
            },
          },
        },
      },
      {
        // Add a $match stage to filter only documents where isMatching is true
        $match: {
          isMatching: true,
        },
      },
      {
        $project: {
          // Define which fields to include in the final result
          ProfileId: 1,
          InvestmentAmount: 1,
          TransactionType: 1,
          createdAt: 1,
          "projectInfo.projectTitle": 1,
          "projectInfo.imageUrl": 1,
        },
      }
    );
  }

  // Add a $sort stage to sort the results by createdAt in descending order
  pipeline.push({
    $sort: {
      createdAt: -1,
    },
  });

  // Execute the aggregation pipeline and return the results
  return Investments_Transaction.aggregate(pipeline).exec();
};

// Create an investmentsRepository object with the defined functions
const investmentsRepository = {
  createInvestmentsTransaction,
  getInvestmentsTransactions,
};

// Export the investmentsRepository for use in other parts of your application
export default investmentsRepository;
