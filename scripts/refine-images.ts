
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Refining product images...")

  const products = await prisma.product.findMany()

  for (const product of products) {
    let newImages: string[] = []
    const nameLower = product.name.toLowerCase()

    if (nameLower.includes('pendant necklace')) {
      newImages = ["/IMG_8344.jpg"]
    } else if (nameLower.includes('hooks')) {
      newImages = ["/IMG_6114.jpg"]
    } else if (nameLower.includes('bbq')) {
      newImages = ["/IMG_6121.jpg"]
    } else if (nameLower.includes('shelf bracket')) {
      newImages = ["/IMG_7641.jpg"]
    } else {
      // "Restu le poti lasa goale"
      newImages = [] 
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { images: JSON.stringify(newImages) }
    })
    
    console.log(`Updated ${product.name} -> ${JSON.stringify(newImages)}`)
  }

  console.log("Done refining images.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
