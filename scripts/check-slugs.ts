
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    select: { name: true, slug: true }
  })
  console.log("Current Slugs:")
  products.forEach(p => console.log(`${p.slug}  (Name: ${p.name})`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
