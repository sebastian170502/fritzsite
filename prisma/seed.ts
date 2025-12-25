import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.stockNotification.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  console.log('✅ Database cleared')

  // Sample products for Fritz's Forge using real images
  const products = [
    {
      name: "Hand Forged Hammer",
      slug: "hand-forged-hammer",
      description: "Professional blacksmith hammer with forged steel head and carefully shaped handle. Perfect weight and balance for metalworking and forging projects.",
      price: 129.99,
      stock: 8,
      images: JSON.stringify([
        "/hammer_final.jpg"
      ]),
      material: "Forged Steel",
      category: "tool",
      isFeatured: true,
    },
    {
      name: "Artisan Necklace",
      slug: "artisan-necklace",
      description: "Handcrafted metal necklace featuring unique forged pendant. A wearable piece of art combining traditional blacksmithing with modern jewelry design.",
      price: 79.99,
      stock: 12,
      images: JSON.stringify([
        "/necklace_final.jpg"
      ]),
      material: "Steel",
      category: "jewelry",
      isFeatured: true,
    },
    {
      name: "Forged Bracket",
      slug: "forged-bracket",
      description: "Hand-forged decorative bracket with traditional scrollwork. Perfect for shelving, signs, or architectural detail. Built to last generations.",
      price: 89.99,
      stock: 15,
      images: JSON.stringify([
        "/bracket_final.jpg"
      ]),
      material: "Wrought Iron",
      category: "hardware",
      isFeatured: true,
    },
    {
      name: "Utility Carabiner",
      slug: "utility-carabiner",
      description: "Heavy-duty hand-forged carabiner. Perfect for camping, climbing gear organization, or as a unique keychain. Tested to hold substantial weight.",
      price: 45.99,
      stock: 20,
      images: JSON.stringify([
        "/carabiner.jpg"
      ]),
      material: "Steel",
      category: "hardware",
      isFeatured: false,
    },
    {
      name: "Forged Hook",
      slug: "forged-hook",
      description: "Traditional hand-forged wall hook with decorative twist. Ideal for coats, tools, or decorative hanging. Combines function with artistry.",
      price: 34.99,
      stock: 25,
      images: JSON.stringify([
        "/hook.jpg"
      ]),
      material: "Wrought Iron",
      category: "hardware",
      isFeatured: false,
    },
    {
      name: "Flipper Knife",
      slug: "flipper-knife",
      description: "Modern tactical flipper knife with smooth action and sharp edge. Features ergonomic handle and reliable locking mechanism.",
      price: 159.99,
      stock: 6,
      images: JSON.stringify([
        "/flipper.jpg"
      ]),
      material: "Steel",
      category: "knife",
      isFeatured: true,
    },
    {
      name: "Hand Forged Nails",
      slug: "hand-forged-nails",
      description: "Set of traditional hand-forged nails. Perfect for historic restoration projects, rustic furniture, or authentic period construction.",
      price: 24.99,
      stock: 30,
      images: JSON.stringify([
        "/nails.jpg"
      ]),
      material: "Iron",
      category: "hardware",
      isFeatured: false,
    },
  ]

  console.log('📦 Creating products...')

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
    console.log(`✅ Created: ${product.name}`)
  }

  console.log(`\n🎉 Successfully seeded ${products.length} products!`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
