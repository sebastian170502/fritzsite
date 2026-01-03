
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Checking CustomOrders ---')
  const count = await prisma.customOrder.count()
  console.log(`Total CustomOrders: ${count}`)
  
  const orders = await prisma.customOrder.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  
  console.log('Most recent orders:')
  orders.forEach(o => {
    console.log(`[${o.createdAt.toISOString()}] ID: ${o.orderId}, Email: ${o.email}, CustomerID: ${o.customerId}`)
  })

  console.log('\n--- Checking Customers ---')
  const customers = await prisma.customer.findMany({ take: 5 })
  customers.forEach(c => {
      console.log(`[Customer] ID: ${c.id}, Email: ${c.email}, Name: ${c.name}`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
