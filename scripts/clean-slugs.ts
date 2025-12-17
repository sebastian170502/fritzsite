
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Cleaning slugs...")
  const products = await prisma.product.findMany()

  for (const product of products) {
    // Convert to lowercase, remove quotes/apostrophes, replace spaces with hyphens
    const newSlug = product.slug
      .toLowerCase()
      .replace(/["']/g, '') // Remove quotes and apostrophes
      .replace(/\s+/g, '-') // Should already be hyphens, but just in case
    
    if (newSlug !== product.slug) {
      console.log(`Fixing: ${product.slug} -> ${newSlug}`)
      try {
        await prisma.product.update({
          where: { id: product.id },
          data: { slug: newSlug }
        })
      } catch (e) {
        console.error(`Failed to update ${product.slug}:`, e)
      }
    }
  }
  console.log("Done cleaning slugs.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
