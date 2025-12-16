import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Cleanup old data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // 2. Create Categories
  const categoriesData = [
    { name: 'Artă Urbană', slug: 'arta-urbana' },
    { name: 'Accesorii', slug: 'accesorii' },
    { name: 'Decorațiuni', slug: 'decoratiuni' },
  ]

  const categories: Record<string, string> = {}
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat })
    categories[cat.name] = created.id
    console.log(`Created category: ${cat.name}`)
  }

  // 3. Create Products
  // Helper to stringify images for SQLite
  const jsonImages = (urls: string[]) => JSON.stringify(urls)

  const productsData = [
    {
      name: 'UAUIM Graffiti Print',
      slug: 'uauim-graffiti-print',
      description: 'Print artizanal stil low-quality graffiti, fundal transparent, text UAUIM',
      price: 150.00,
      stock: 5,
      images: jsonImages(['https://placehold.co/600x600/1a1a1a/ffffff?text=UAUIM+Graffiti']),
      isFeatured: true,
      categoryId: categories['Artă Urbană'],
    },
    {
      name: 'Brosă Ceramică Pisică',
      slug: 'brosa-ceramica-pisica',
      description: 'O broșă mică pictată manual, în formă de pisică.',
      price: 45.00,
      stock: 20,
      images: jsonImages(['https://placehold.co/600x600/e6e2dd/5d4037?text=Cat+Brooch']),
      categoryId: categories['Accesorii'],
    },
    {
      name: 'Vază Minimalistă Lut',
      slug: 'vaza-minimalista-lut',
      description: 'Vază din lut ars, textură aspră, ideală pentru flori uscate.',
      price: 120.00,
      stock: 8,
      images: jsonImages(['https://placehold.co/600x600/d7ccc8/5d4037?text=Clay+Vase']),
      categoryId: categories['Decorațiuni'],
    },
    {
      name: 'Geantă Textilă Reciclată',
      slug: 'geanta-textila-reciclata',
      description: 'Făcută din materiale sustenabile, perfectă pentru cumpărături.',
      price: 80.00,
      stock: 12,
      images: jsonImages(['https://placehold.co/600x600/f5ebe0/5d4037?text=Tote+Bag']),
      categoryId: categories['Accesorii'],
    },
  ]

  for (const p of productsData) {
    await prisma.product.create({ data: p })
  }

  console.log(`✅ Seed finished. Created ${productsData.length} products.`)
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
