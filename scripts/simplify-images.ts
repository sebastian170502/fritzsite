
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Applying simplified image names...")

  // 1. Pendant Necklace -> necklace.jpg
  await prisma.product.updateMany({
    where: { name: { contains: 'Pendant' } },
    data: { images: JSON.stringify(["/necklace.jpg"]) }
  })
  
  // Also Frederik's Cross? User said "img8344 pentru pendant necklaces". 
  // Maybe apply to all Crosses? User kept it vague. I'll stick to Pendant as requested specifically or verify context.
  // Actually, let's play it safe and apply to "Cross" if it doesn't match others, or just Pendant. 
  // User said "img8344 pentru pendant necklaces" (plural).
  // I'll stick to 'Pendant' query for now.

  // 2. Shelf Bracket -> bracket.jpg
  await prisma.product.updateMany({
    where: { name: { contains: 'Bracket' } },
    data: { images: JSON.stringify(["/bracket.jpg"]) }
  })

  // 3. Hooks -> hook.jpg
  await prisma.product.updateMany({
    where: { name: { contains: 'Hook' } },
    data: { images: JSON.stringify(["/hook.jpg"]) }
  })
  // Also apply hook image to nails/carabiner as fallback? 
  // Previous request said: "img6114 s hooks... restu le poti lasa goale".
  // So I will NOT apply hook image to others. Only Hooks.

  // 4. BBQ -> flipper.jpg
  await prisma.product.updateMany({
    where: { name: { contains: 'BBQ' } },
    data: { images: JSON.stringify(["/flipper.jpg"]) }
  })

  console.log("Database updated with simple filenames.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
