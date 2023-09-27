import express, { Router, Request, Response } from "express";
import {
  loginValidator,
  registerValidator,
} from "../../middlewares/validators/authValidators";
import { register, login } from "../../controllers/auth";

// Create an Express router instance
const router: Router = express.Router();

/**
 * Route for user registration.
 * POST /api/auth/register
 * Validates the request body using 'registerValidator' middleware
 * Calls the 'register' controller function for user registration
 */
router.post(
  "/register",
  registerValidator, // Middleware for request validation
  async (req: Request, res: Response) => {
    await register(req, res); // Call the 'register' controller function
  }
);

/**
 * Route for user login.
 * POST /api/auth/login
 * Validates the request body using 'loginValidator' middleware
 * Calls the 'login' controller function for user login
 */
router.post(
  "/login",
  loginValidator, // Middleware for request validation
  async (req: Request, res: Response) => {
    await login(req, res); // Call the 'login' controller function
  }
);

export default router;
