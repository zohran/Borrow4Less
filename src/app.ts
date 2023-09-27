// Import required modules and dependencies
import dotenv from "dotenv";
import cors from "cors";
import express, {
  Request,
  Response,
  NextFunction,
  Application,
  ErrorRequestHandler,
} from "express";
import { Server } from "http";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

// Load environment variables from a .env file
dotenv.config();

// Create an Express application
const app: Application = express();

// Use the cors middleware to enable CORS for your app
app.use(cors());

// Enable middleware for parsing URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true }), express.json());

// Import route handlers for different parts of the application
import authRoutes from "./routes/auth/authRoutes";
import userRoutes from "./routes/user/userRoutes";
import transactionRoutes from "./routes/transaction/transactionRoutes";
import investmentsRoutes from "./routes/investments/investmentsRoutes";

// Use route handlers for specific routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/transaction", transactionRoutes);
app.use("/api/v1/investments", investmentsRoutes);

// Define a simple root route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello from ts backend app!");
});

// Swagger Docs Route handler
const swaggerDoc = YAML.load(path.join(__dirname, "../swagger.yaml"));
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Handle 404 Not Found errors with a custom error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createHttpError.NotFound());
});

// Define an error handler middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
};

app.use(errorHandler);

// Define the port number to listen on, defaulting to 5000
const port: number = Number(process.env.PORT) || 5000;

// Create an HTTP server and start listening on the specified port
const server: Server = app.listen(port, async () => {
  try {
    // Get the MongoDB URI from environment variables, defaulting to an empty string
    const mongoUri: string = process.env.MONGO_URI || "";

    // Connect to the MongoDB database
    mongoose.connect(mongoUri).then(() => {
      console.log("Database connection established!");
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
});
