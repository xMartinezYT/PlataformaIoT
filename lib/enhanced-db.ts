import { neon, neonConfig } from "@neondatabase/serverless"
import { setTimeout } from "timers/promises"

// Configure Neon client
neonConfig.fetchConnectionCache = true

// Error types for better error handling
export enum DatabaseErrorType {
  CONNECTION = "CONNECTION",
  AUTHENTICATION = "AUTHENTICATION",
  QUERY = "QUERY",
  TRANSACTION = "TRANSACTION",
  TIMEOUT = "TIMEOUT",
  UNKNOWN = "UNKNOWN",
}

export class DatabaseError extends Error {
  type: DatabaseErrorType
  originalError: Error | null
  query?: string
  params?: any[]

  constructor(
    message: string,
    type: DatabaseErrorType = DatabaseErrorType.UNKNOWN,
    originalError: Error | null = null,
    query?: string,
    params?: any[],
  ) {
    super(message)
    this.name = "DatabaseError"
    this.type = type
    this.originalError = originalError
    this.query = query
    this.params = params
  }
}

// Configuration options
interface DatabaseClientOptions {
  connectionString?: string
  maxRetries?: number
  initialRetryDelay?: number
  maxRetryDelay?: number
  debug?: boolean
}

export class DatabaseClient {
  private sql: any
  private connectionString: string
  private maxRetries: number
  private initialRetryDelay: number
  private maxRetryDelay: number
  private debug: boolean
  private isConnected = false
  private lastError: Error | null = null

  constructor(options: DatabaseClientOptions = {}) {
    this.connectionString = options.connectionString || process.env.DATABASE_URL || ""
    this.maxRetries = options.maxRetries || 3
    this.initialRetryDelay = options.initialRetryDelay || 100 // ms
    this.maxRetryDelay = options.maxRetryDelay || 5000 // ms
    this.debug = options.debug || process.env.NODE_ENV === "development"

    if (!this.connectionString) {
      throw new DatabaseError(
        "No database connection string provided. Set DATABASE_URL environment variable or pass connectionString option.",
        DatabaseErrorType.CONNECTION,
      )
    }

    try {
      this.sql = neon(this.connectionString)
      this.log("Database client initialized")
    } catch (error: any) {
      this.lastError = error
      throw new DatabaseError(
        `Failed to initialize database client: ${error.message}`,
        DatabaseErrorType.CONNECTION,
        error,
      )
    }
  }

  /**
   * Execute a SQL query with retry logic
   */
  async query<T = any>(text: string, params: any[] = []): Promise<T> {
    let retries = 0
    let lastError: Error | null = null

    while (retries <= this.maxRetries) {
      try {
        if (retries > 0) {
          this.log(`Retry attempt ${retries}/${this.maxRetries}`)
        }

        const result = await this.sql(text, params)
        this.isConnected = true
        return result as T
      } catch (error: any) {
        lastError = error
        this.isConnected = false
        this.lastError = error

        // Determine if we should retry based on error type
        if (this.isRetryableError(error) && retries < this.maxRetries) {
          const delay = this.calculateRetryDelay(retries)
          this.log(`Query failed, retrying in ${delay}ms: ${error.message}`)
          await setTimeout(delay)
          retries++
        } else {
          // Non-retryable error or max retries reached
          break
        }
      }
    }

    // If we get here, all retries failed
    const errorType = this.classifyError(lastError)
    throw new DatabaseError(
      `Database query failed after ${retries} retries: ${lastError?.message}`,
      errorType,
      lastError as Error,
      text,
      params,
    )
  }

  /**
   * Execute a transaction with retry logic
   */
  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    let retries = 0
    let lastError: Error | null = null

    while (retries <= this.maxRetries) {
      try {
        if (retries > 0) {
          this.log(`Transaction retry attempt ${retries}/${this.maxRetries}`)
        }

        // Start transaction
        await this.sql`BEGIN`

        try {
          // Execute the callback
          const result = await callback(this.sql)

          // Commit the transaction
          await this.sql`COMMIT`
          return result
        } catch (error) {
          // Rollback on error
          await this.sql`ROLLBACK`
          throw error
        }
      } catch (error: any) {
        lastError = error
        this.lastError = error

        // Determine if we should retry based on error type
        if (this.isRetryableError(error) && retries < this.maxRetries) {
          const delay = this.calculateRetryDelay(retries)
          this.log(`Transaction failed, retrying in ${delay}ms: ${error.message}`)
          await setTimeout(delay)
          retries++
        } else {
          // Non-retryable error or max retries reached
          break
        }
      }
    }

    // If we get here, all retries failed
    throw new DatabaseError(
      `Database transaction failed after ${retries} retries: ${lastError?.message}`,
      DatabaseErrorType.TRANSACTION,
      lastError as Error,
    )
  }

  /**
   * Check if the database connection is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.sql`SELECT 1`
      this.isConnected = true
      return true
    } catch (error) {
      this.isConnected = false
      this.lastError = error as Error
      return false
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      lastError: this.lastError ? this.lastError.message : null,
    }
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase()

    // Connection-related errors are typically retryable
    return (
      message.includes("connection") ||
      message.includes("timeout") ||
      message.includes("socket") ||
      message.includes("network") ||
      message.includes("temporarily unavailable") ||
      message.includes("too many connections") ||
      message.includes("connection pool timeout")
    )
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(retryCount: number): number {
    const delay = Math.min(this.maxRetryDelay, this.initialRetryDelay * Math.pow(2, retryCount))

    // Add jitter to prevent thundering herd problem
    return delay * (0.5 + Math.random() * 0.5)
  }

  /**
   * Classify error type based on error message
   */
  private classifyError(error: Error | null): DatabaseErrorType {
    if (!error) return DatabaseErrorType.UNKNOWN

    const message = error.message.toLowerCase()

    if (message.includes("connection") || message.includes("socket") || message.includes("network")) {
      return DatabaseErrorType.CONNECTION
    }

    if (message.includes("authentication") || message.includes("password") || message.includes("permission")) {
      return DatabaseErrorType.AUTHENTICATION
    }

    if (message.includes("timeout")) {
      return DatabaseErrorType.TIMEOUT
    }

    if (message.includes("transaction")) {
      return DatabaseErrorType.TRANSACTION
    }

    return DatabaseErrorType.QUERY
  }

  /**
   * Log messages if debug mode is enabled
   */
  private log(message: string) {
    if (this.debug) {
      console.log(`[DatabaseClient] ${message}`)
    }
  }
}

// Create a singleton instance
let dbClient: DatabaseClient | null = null

export function getDbClient(options: DatabaseClientOptions = {}): DatabaseClient {
  if (!dbClient) {
    dbClient = new DatabaseClient(options)
  }
  return dbClient
}

// Helper function to execute SQL queries
export async function query<T = any>(text: string, params: any[] = []): Promise<T> {
  const client = getDbClient()
  return client.query<T>(text, params)
}

// Helper function for transactions
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = getDbClient()
  return client.transaction<T>(callback)
}

// Export a health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = getDbClient()
    return await client.healthCheck()
  } catch (error) {
    return false
  }
}
