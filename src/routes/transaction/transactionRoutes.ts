import express, { Router, Request, Response } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { depositOrWithdrawValidator } from "../../middlewares/validators/transactionValidators";
import {
  deposit,
  getUserTransactionsList,
  withdraw,
} from "../../controllers/transactions";

// Create an Express router instance
const router: Router = express.Router();

/**
 * Route for depositing funds into a user's account.
 * PATCH /api/transaction/deposit
 * Validates the request body using 'depositOrWithdrawValidator' middleware
 * Requires user authentication using 'authenticate' middleware
 * Calls the 'deposit' controller function for depositing funds
 */
router.patch(
  "/deposit",
  depositOrWithdrawValidator, // Middleware for request validation
  authenticate, // Middleware for user authentication
  async (req: Request, res: Response) => {
    await deposit(req, res); // Call the 'deposit' controller function
  }
);

/**
 * Route for withdrawing funds from a user's account.
 * PATCH /api/transaction/withdraw
 * Validates the request body using 'depositOrWithdrawValidator' middleware
 * Requires user authentication using 'authenticate' middleware
 * Calls the 'withdraw' controller function for withdrawing funds
 */
router.patch(
  "/withdraw",
  depositOrWithdrawValidator, // Middleware for request validation
  authenticate, // Middleware for user authentication
  async (req: Request, res: Response) => {
    await withdraw(req, res); // Call the 'withdraw' controller function
  }
);

/**
 * Route for retrieving a user's transaction list.
 * GET /api/transaction/transaction-list
 * Requires user authentication using 'authenticate' middleware
 * Calls the 'getUserTransactionsList' controller function to retrieve transactions
 */
router.get(
  "/transaction-list",
  authenticate, // Middleware for user authentication
  async (req: Request, res: Response) => {
    await getUserTransactionsList(req, res); // Call the 'getUserTransactionsList' controller function
  }
);

export default router;
