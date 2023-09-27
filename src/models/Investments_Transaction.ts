// Import necessary modules from mongoose library
import { Schema, model, Document } from "mongoose";

// Define an interface for the Investments Transaction document,
// extending the Document interface provided by mongoose.
export interface I_Investments_Transaction extends Document {
  ProfileId: Schema.Types.ObjectId; // Profile ID associated with the transaction
  InvestmentAmount: number; // Amount of the investment
  ProjectId: Schema.Types.ObjectId; // ID of the project associated with the transaction
  TransactionType?: string; // Optional transaction type
}

// Create a schema for the Investments Transaction using the imported Schema class.
// The schema defines the structure and validation rules for the document.
const investmentTransactionSchema = new Schema<I_Investments_Transaction>(
  {
    ProfileId: {
      type: Schema.Types.ObjectId, // Field type is ObjectID
      ref: "User", // Reference to the "User" collection
      required: true, // Field is required
    },
    InvestmentAmount: {
      type: Number, // Field type is a number
      required: true, // Field is required
    },
    ProjectId: {
      type: Schema.Types.ObjectId, // Field type is ObjectID
      ref: "Project", // Reference to the "Project" collection
      required: true, // Field is required
    },
    TransactionType: {
      type: String, // Field type is a string
      default: "",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create a model for the Investments Transaction using the schema.
const Investments_Transaction = model<I_Investments_Transaction>(
  "Investments_Transaction", // Name of the model
  investmentTransactionSchema // The schema to use for the model
);

// Export the Investments_Transaction model for use in other parts of your application.
export default Investments_Transaction;
