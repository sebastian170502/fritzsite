
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Testing Prisma Connection...')
  try {
    const orderId = `TEST-${Date.now()}`
    console.log(`Attempting to create CustomOrder with orderId: ${orderId}`)

    const customOrder = await prisma.customOrder.create({
      data: {
        orderId,
        email: 'test@example.com',
        name: 'Debug User',
        phone: '1234567890',
        orderType: 'scratch',
        details: JSON.stringify({ note: 'Debug test' }),
        images: '[]',
        status: 'pending_quote'
      }
    })
    
    console.log('✅ Successfully created CustomOrder:', customOrder.id)
  } catch (e) {
    console.error('❌ Failed to create CustomOrder:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
