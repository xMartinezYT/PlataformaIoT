import { neon } from "@neondatabase/serverless"

// Create a SQL query executor using the Neon serverless driver
const sql = neon(process.env.DATABASE_URL!)

// Helper function to execute SQL queries
export async function query(text: string, params: any[] = []) {
  try {
    return await sql(text, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function for transactions
export async function transaction<T>(callback: (sql: any) => Promise<T>): Promise<T> {
  try {
    await sql("BEGIN")
    const result = await callback(sql)
    await sql("COMMIT")
    return result
  } catch (error) {
    await sql("ROLLBACK")
    console.error("Transaction error:", error)
    throw error
  }
}
