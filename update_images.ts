import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const updates = [
    {
      name: 'Carbon Steel Tinsmith Hammer',
      images: ['/il_1588xN.7325591393_mv7o.avif']
    },
    {
      name: 'Carbon Steel "Frederick\'s" Cross ', // Note the trailing space in DB
      images: ['/IMG_6104.jpg']
    },
    {
      name: 'Carbon Steel Carabiner Clip ', // Note the trailing space
      images: ['/IMG_6845.jpeg']
    },
    {
      name: 'Carbon Steel Nails ', // Note the trailing space
      images: ['/IMG_7070.HEIC']
    },
    {
      name: 'Carbon Steel Shelf Brackets',
      images: ['/bracket.jpg']
    },
    {
      name: 'Carbon Steel Cross Pendant Necklace',
      images: ['/necklace.jpg']
    }
  ]

  for (const update of updates) {
    // Try fuzzy match or exact match
    // We'll try to find by name containing the core string to avoid whitespace issues if possible
    // But update says "name" so let's try findFirst
    const product = await prisma.product.findFirst({
        where: {
            name: {
                contains: update.name.trim() 
            }
        }
    })

    if (product) {
        await prisma.product.update({
            where: { id: product.id },
            data: {
                images: JSON.stringify(update.images)
            }
        })
        console.log(`Updated images for: ${product.name}`)
    } else {
        console.log(`Product not found for: ${update.name}`)
    }
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
