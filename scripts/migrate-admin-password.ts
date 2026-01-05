#!/usr/bin/env node
/**
 * Migration Script: Convert Plain Text Admin Password to Bcrypt Hash
 * 
 * This script helps migrate from plain text ADMIN_PASSWORD to bcrypt hashed ADMIN_PASSWORD_HASH
 * 
 * Usage:
 *   node scripts/migrate-admin-password.js <your-admin-password>
 * 
 * The script will output the bcrypt hash that should be set as ADMIN_PASSWORD_HASH in .env
 */

import bcrypt from 'bcryptjs'

async function generatePasswordHash(password: string): Promise<string> {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

async function main() {
    const password = process.argv[2]

    if (!password) {
        console.error('❌ Error: Password argument required')
        console.log('\nUsage:')
        console.log('  npx tsx scripts/migrate-admin-password.ts <your-admin-password>')
        console.log('\nExample:')
        console.log('  npx tsx scripts/migrate-admin-password.ts mySecurePassword123')
        process.exit(1)
    }

    if (password.length < 8) {
        console.error('❌ Error: Password must be at least 8 characters long')
        process.exit(1)
    }

    console.log('🔐 Generating bcrypt hash for admin password...\n')

    const hash = await generatePasswordHash(password)

    console.log('✅ Hash generated successfully!\n')
    console.log('Add this to your .env or .env.local file:\n')
    console.log(`ADMIN_PASSWORD_HASH="${hash}"`)
    console.log('\n⚠️  Remove the old ADMIN_PASSWORD variable from your .env file')
    console.log('\n📝 Note: Keep this hash secure and never commit it to version control')
}

main().catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
})
