import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a connection pool
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/retaliation_esports'
const pool = new Pool({ connectionString })

// Create Prisma adapter
const adapter = new PrismaPg(pool)

// Initialize Prisma Client with adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
