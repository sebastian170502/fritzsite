#!/usr/bin/env node
/**
 * Generate bcrypt password hash for admin password
 * Usage: npm run hash-password
 */

import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function hashPassword() {
    rl.question('Enter password to hash: ', async (password) => {
        if (!password) {
            console.error('Password cannot be empty');
            process.exit(1);
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        console.log('\n✅ Password hashed successfully!');
        console.log('\nAdd this to your .env.local file:');
        console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
        console.log('\n⚠️  Remove or comment out ADMIN_PASSWORD if present');

        rl.close();
    });
}

hashPassword().catch(console.error);
