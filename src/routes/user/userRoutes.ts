import express, { Router, Request, Response } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { getUserBalance } from "../../controllers/user";

// Create an Express router instance
const router: Router = express.Router();

/**
 * Route for retrieving a user's balance.
 * GET /api/user/user-balance
 * Requires user authentication using 'authenticate' middleware
 * Calls the 'getUserBalance' controller function to retrieve the user's balance
 */
router.get(
  "/user-balance",
  authenticate, // Middleware for user authentication
  async (req: Request, res: Response) => {
    await getUserBalance(req, res); // Call the 'getUserBalance' controller function
  }
);

export default router;
