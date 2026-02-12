const bcrypt = require('bcryptjs');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Generate bcrypt hash for a password
 * This script helps you create hashed passwords for manual DynamoDB insertion
 */
async function generateHash() {
  console.log('\n========================================');
  console.log('  ParkMate Password Hash Generator');
  console.log('========================================\n');
  
  rl.question('Enter password to hash: ', async (password) => {
    
    if (!password || password.length < 6) {
      console.log('\n❌ Error: Password must be at least 6 characters long\n');
      rl.close();
      return;
    }

    try {
      // Generate salt and hash (salt rounds = 10)
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      console.log('\n✅ Password hashed successfully!\n');
      console.log('========================================');
      console.log('Original Password:', password);
      console.log('========================================');
      console.log('Hashed Password (copy this):');
      console.log(hashedPassword);
      console.log('========================================\n');
      console.log('📝 Use this hashed password when inserting user into DynamoDB\n');
      
    } catch (error) {
      console.error('\n❌ Error generating hash:', error.message);
    }
    
    rl.close();
  });
}

// Run the generator
generateHash();

// Handle readline close
rl.on('close', () => {
  console.log('Exiting...\n');
  process.exit(0);
});