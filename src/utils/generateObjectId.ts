/**
 * Generate a unique hexadecimal string that can be used as an ObjectId.
 * This function combines a timestamp and a random suffix to create a unique ID.
 * @returns {string} A unique hexadecimal string.
 */
const generateObjectId = (): string => {
  // Generate a timestamp in seconds, convert it to a hexadecimal string.
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);

  // Generate a random hexadecimal suffix with 16 characters.
  const suffix = "xxxxxxxxxxxxxxxx"
    // Replace each 'x' character with a random hexadecimal digit (0-9, a-f).
    .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
    .toLowerCase();

  // Combine the timestamp and the random suffix to create a unique ID.
  return `${timestamp}${suffix}`;
};

export default generateObjectId;
