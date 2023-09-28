import express, { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import {
  getInvestmentTransactionsOfAUser,
  invest,
  getAllInvestOfAUser,
} from "../../controllers/investments";
import {
  getInvestmentsTransactionsValidator,
  investmentTransactionValidator,
  getInvestsValidator,
} from "../../middlewares/validators/investmentTransactionValidator";

// Create an Express router instance
const router: Router = express.Router();

// Define a POST route for handling investments
router.post(
  "/invest",
  investmentTransactionValidator, // Validate the investment transaction request
  authenticate, // Authenticate the user (ensure they are logged in)
  invest // Handle the investment transaction
);

// Define a GET route for fetching investment transactions
router.get(
  "/transactions",
  getInvestmentsTransactionsValidator, // Validate the request parameters
  authenticate, // Authenticate the user (ensure they are logged in)
  getInvestmentTransactionsOfAUser // Handle the request to get investment transactions
);

// Define a GET route for fetching invests of a user
router.get(
  "/invest",
  getInvestsValidator, // Validate the request parameters
  authenticate, // Authenticate the user (ensure they are logged in)
  getAllInvestOfAUser // Handle the request to get invests of a user
);

export default router;
