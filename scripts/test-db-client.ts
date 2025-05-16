import { query, transaction, checkDatabaseHealth } from "@/lib/enhanced-db"

async function testEnhancedDbClient() {
  console.log("Testing Enhanced Database Client")
  console.log("================================")

  try {
    // Test health check
    console.log("\n1. Testing health check...")
    const isHealthy = await checkDatabaseHealth()
    console.log(`Health check result: ${isHealthy ? "Healthy ✅" : "Unhealthy ❌"}`)

    if (!isHealthy) {
      console.error("Database is not healthy, cannot proceed with tests")
      return
    }

    // Test basic query
    console.log("\n2. Testing basic query...")
    const dbInfo = await query("SELECT current_database() as db, current_user as user")
    console.log(`Connected to database: ${dbInfo[0].db} as user: ${dbInfo[0].user} ✅`)

    // Test query with parameters
    console.log("\n3. Testing query with parameters...")
    const tables = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = $1 LIMIT 5", [
      "public",
    ])
    console.log(`Found ${tables.length} tables in public schema ✅`)
    tables.forEach((table, i) => console.log(`   ${i + 1}. ${table.table_name}`))

    // Test transaction
    console.log("\n4. Testing transaction...")
    const transactionResult = await transaction(async (sql) => {
      // Get current count
      const beforeCount = await sql`SELECT COUNT(*) as count FROM users`
      console.log(`   Users before: ${beforeCount[0].count}`)

      // Create a temporary user
      const tempUser = await sql`
        INSERT INTO users (id, email, password_hash, name, role) 
        VALUES (gen_random_uuid(), 'temp-${Date.now()}@example.com', 'temp', 'Temporary User', 'USER') 
        RETURNING id
      `
      console.log(`   Created temporary user with ID: ${tempUser[0].id}`)

      // Get new count
      const afterCount = await sql`SELECT COUNT(*) as count FROM users`
      console.log(`   Users after: ${afterCount[0].count}`)

      // Delete the temporary user
      await sql`DELETE FROM users WHERE id = ${tempUser[0].id}`
      console.log(`   Deleted temporary user`)

      // Final count
      const finalCount = await sql`SELECT COUNT(*) as count FROM users`
      console.log(`   Users final: ${finalCount[0].count}`)

      return {
        beforeCount: Number.parseInt(beforeCount[0].count),
        afterCount: Number.parseInt(afterCount[0].count),
        finalCount: Number.parseInt(finalCount[0].count),
      }
    })

    if (transactionResult.beforeCount === transactionResult.finalCount) {
      console.log("Transaction test passed ✅")
    } else {
      console.log("Transaction test failed ❌")
    }

    // Test error handling
    console.log("\n5. Testing error handling...")
    try {
      await query("SELECT * FROM non_existent_table")
      console.log("Error handling test failed (should have thrown an error) ❌")
    } catch (error) {
      console.log("Error handling test passed (caught expected error) ✅")
      console.log(`   Error message: ${(error as Error).message}`)
    }

    console.log("\nAll tests completed successfully! ✅")
  } catch (error) {
    console.error("Test failed with error:", error)
  }
}

// Run the test
testEnhancedDbClient()
  .catch(console.error)
  .finally(() => process.exit())
