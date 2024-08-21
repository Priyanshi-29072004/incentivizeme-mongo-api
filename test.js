const bcrypt = require("bcryptjs");

async function testBcrypt() {
  const password = "123"; // The plain text password

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);

  // Simulate the stored password from the database
  const storedPassword = hashedPassword;

  // Compare the plain password with the hashed password
  const isMatch = await bcrypt.compare(password, storedPassword);
  console.log("Password Match Result:", isMatch); // Should log true
}

testBcrypt();
