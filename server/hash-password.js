const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.log('Usage: node hash-password.js <your_password>');
    process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('\n--- Hashed Password ---');
    console.log(hash);
    console.log('------------------------\n');
    console.log('Copy the hash above and paste it into your .env or Vercel Environment Variables as ADMIN_PASSWORD.');
});
