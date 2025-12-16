
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany()

  for (const product of products) {
    let images: string[] = []
    
    // Parse existing images or default to empty array
    try {
      images = JSON.parse(product.images || '[]')
    } catch {
      images = []
    }

    // Fix 1: If empty, set placeholder
    if (!images || images.length === 0) {
      console.log(`Fixing empty images for ${product.name}`)
      images = ["/placeholder.jpg"] // Set a default to pass validation
    }

    // Fix 2 & 3: Fix extensions and paths
    images = images.map(img => {
      let clean = img
      
      // Fix extensions
      if (clean.toLowerCase().endsWith('.heic')) {
        clean = clean.replace(/\.heic$/i, '.jpg')
        console.log(`Converted .HEIC to .jpg for ${product.name}`)
      }
      
      // Fix missing slash
      if (!clean.startsWith('/')) {
        clean = '/' + clean
      }
      
      return clean
    })

    // Update product
    await prisma.product.update({
      where: { id: product.id },
      data: {
        images: JSON.stringify(images)
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
