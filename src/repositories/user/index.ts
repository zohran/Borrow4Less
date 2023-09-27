import User, { IUser } from "../../models/User";

/**
 * Find a user by a specified property in the database.
 * @param key - The property to search by (e.g., "_id", "email").
 * @param value - The value to search for.
 * @returns A Promise that resolves to the found user or null if not found.
 */
const findUserByProperty = async (
  key: string,
  value: string
): Promise<IUser | null> => {
  if (key === "_id") {
    // Use User.findById when searching by _id
    return User.findById(value);
  }
  // Use User.findOne for other properties
  return User.findOne({ [key]: value });
};

/**
 * Create a new user in the database.
 * @param user - An object containing user data (name, email, password).
 * @returns A Promise that resolves to the created user.
 */
const createNewUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  const user = new User({
    name,
    email,
    password,
  });
  // Save the user to the database
  return user.save();
};

/**
 * Update a user's balance in the database.
 * @param email - The email of the user to update.
 * @param amount - The amount to increment the user's balance by.
 * @returns A Promise that resolves to the updated user or null if not found.
 */
const updateUserBalance = async (
  email: string,
  amount: number
): Promise<IUser | null> => {
  // Update the user's balance by incrementing it with the specified 'amount'
  return User.findOneAndUpdate(
    { email },
    { $inc: { balance: amount } }, // Use $inc to increment the balance by the specified amount
    { new: true } // To get the updated document as a result
  );
};

// Repository object containing the exported functions
const userRepository = {
  findUserByProperty,
  createNewUser,
  updateUserBalance,
};

export default userRepository;
