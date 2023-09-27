import { Schema, model, Document } from "mongoose";

// Define an interface to represent the shape of a user document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  balance: number;
  balanceType: "usd";
}

// Create a Mongoose schema for the User collection
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String, // Field for the user's name (string type)
      required: true, // Name is required
    },
    email: {
      type: String, // Field for the user's email (string type)
      required: true, // Email is required
      unique: true, // Email must be unique
    },
    password: {
      type: String, // Field for the user's password (string type)
      required: true, // Password is required
    },
    balance: {
      type: Number, // Field for the user's balance (number type)
      default: 0, // Default balance is 0
    },
    balanceType: {
      type: String, // Field for the user's balance type (string type)
      enum: ["usd"], // Only "usd" is allowed as a balance type
      default: "usd", // Default balance type is "usd"
    },
  },
  {
    timestamps: true, // Add timestamps (createdAt and updatedAt) to documents
  }
);

// Create a Mongoose model for the User collection
const User = model<IUser>("User", userSchema);

export default User;
