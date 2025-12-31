import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  // Find the product with empty ID
  // Note: Prisma might struggle to find by empty ID directly if it violates schema, but we saw it in findMany
  const products = await prisma.product.findMany();
  const brokenProduct = products.find((p) => p.id === "");

  if (brokenProduct) {
    console.log(`Found broken product: ${brokenProduct.name}`);

    // We can't update ID directly easily in some DBs, but let's try or delete/recreate
    // Since ID is primary key, update might be tricky.
    // Let's try to delete and recreate it, preserving other data.

    const newId = uuidv4();

    // 1. Create copy
    const { id, ...data } = brokenProduct;

    await prisma.product.create({
      data: {
        ...data,
        id: newId,
      },
    });
    console.log(`Created replacement product with ID: ${newId}`);

    // 2. Delete old - IF we can select it.
    // Deleting by empty ID might work.
    try {
      await prisma.product.delete({
        where: { id: "" },
      });
      console.log("Deleted broken product.");
    } catch (e) {
      console.error(
        "Failed to delete broken product (might need manual cleanup later):",
        e
      );
    }
  } else {
    console.log("No broken product found.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
