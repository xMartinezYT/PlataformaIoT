import { Pool } from "pg"

// Create a singleton database connection
let db: Pool | null = null

export function getDb() {
  if (!db) {
    db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    })
  }
  return db
}

// Helper function to execute SQL queries
export async function query(text: string, params?: any[]) {
  const client = await getDb().connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}
