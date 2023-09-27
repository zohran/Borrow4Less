const isValidEmail = (email: string): boolean => {
  // Regular expression pattern for a valid email address
  var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Use the test() method to check if the email matches the pattern
  return pattern.test(email);
};

export default isValidEmail;
