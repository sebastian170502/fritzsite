import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: any
}

// Create base client with logging
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })

  // Use Prisma extension for query logging (replaces deprecated $use)
  return client.$extends({
    name: 'QueryLogger',
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const start = performance.now()
          const result = await query(args)
          const end = performance.now()
          const duration = end - start

          // Log slow queries
          if (duration > 100) {
            console.warn(`⚠️  Slow query: ${model}.${operation} took ${duration.toFixed(2)}ms`)
          }

          return result
        },
      },
    },
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
