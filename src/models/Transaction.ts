import { Schema, model, Document } from "mongoose";

// Define an interface to represent the shape of a transaction document
export interface ITransaction extends Document {
  user: Schema.Types.ObjectId;
  amount: number;
  transactionType: "withdraw" | "deposit";
}

// Create a Mongoose schema for the Transaction collection
const transactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId, // Field for the user's ObjectId reference
      ref: "User", // Reference the "User" collection
      required: true, // User is required for the transaction
    },
    amount: {
      type: Number, // Field for the transaction amount (number type)
      required: true, // Amount is required
    },
    transactionType: {
      type: String, // Field for the transaction type (string type)
      required: true, // Transaction type is required
      enum: ["withdraw", "deposit", "invest"], // Only "withdraw" or "deposit" or "invest" allowed
    },
  },
  {
    timestamps: true, // Add timestamps (createdAt and updatedAt) to documents
  }
);

// Create a Mongoose model for the Transaction collection
const Transaction = model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
