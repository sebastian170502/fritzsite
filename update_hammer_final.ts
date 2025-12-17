import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const product = await prisma.product.findFirst({
        where: {
            name: {
                contains: 'Tinsmith Hammer'
            }
        }
    })

    if (product) {
        await prisma.product.update({
            where: { id: product.id },
            data: {
                images: JSON.stringify(['/hammer_final.jpg'])
            }
        })
        console.log(`Updated images for: ${product.name} to /hammer_final.jpg`)
    } else {
        console.log(`Product Tinsmith Hammer not found`)
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
