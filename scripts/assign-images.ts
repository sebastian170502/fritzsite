
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Updating product images...")

  // 1. BBQ Flipper -> IMG_6121.jpg
  await prisma.product.updateMany({
    where: { name: { contains: 'BBQ Flipper' } },
    data: { images: JSON.stringify(["/IMG_6121.jpg"]) }
  })
  console.log("Updated BBQ Flipper")

  // 2. Shelf Brackets -> IMG_7641.jpg
  await prisma.product.updateMany({
    where: { name: { contains: 'Shelf Bracket' } },
    data: { images: JSON.stringify(["/IMG_7641.jpg"]) }
  })
  console.log("Updated Shelf Brackets")

  // 3. Crosses (Frederick's & Pendant) -> IMG_8344.jpg
  await prisma.product.updateMany({
    where: { name: { contains: 'Cross' } },
    data: { images: JSON.stringify(["/IMG_8344.jpg"]) }
  })
  console.log("Updated Crosses")

  // 4. Tinsmith Hammer -> IMG_6114.jpg (Making an educated guess or using it as fallback)
  await prisma.product.updateMany({
    where: { name: { contains: 'Hammer' } },
    data: { images: JSON.stringify(["/IMG_6114.jpg"]) }
  })
  console.log("Updated Hammer")

  // 5. Hooks -> IMG_6114.jpg (Fallback/Placeholder using a real image)
  await prisma.product.updateMany({
    where: { name: { contains: 'Hook' } },
    data: { images: JSON.stringify(["/IMG_6114.jpg"]) }
  })
  
  // 6. Nails -> IMG_6114.jpg (Fallback)
  await prisma.product.updateMany({
    where: { name: { contains: 'Nail' } },
    data: { images: JSON.stringify(["/IMG_6114.jpg"]) }
  })
  
  // 7. Carabiner -> IMG_6114.jpg (Fallback)
  await prisma.product.updateMany({
    where: { name: { contains: 'Carabiner' } },
    data: { images: JSON.stringify(["/IMG_6114.jpg"]) }
  })
  
  console.log("Done updating images.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
