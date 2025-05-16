import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Function to check database connection
async function checkDatabase() {
  try {
    // Try a simple query to check if database is connected
    await prisma.$queryRaw`SELECT 1`
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Function to make a test API request to inspect the response
async function testApiEndpoint(url: string) {
  try {
    console.log(`Testing API endpoint: ${url}`)
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    // Get the response content
    const text = await response.text()

    console.log(`Status: ${response.status} ${response.statusText}`)
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()))

    // Check if response is HTML
    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
      console.error("❌ Received HTML instead of JSON:")
      console.log(text.substring(0, 300) + "...")
      return false
    }

    // Try to parse as JSON
    try {
      const json = JSON.parse(text)
      console.log("✅ Valid JSON response:")
      console.log(json)
      return true
    } catch (e) {
      console.error("❌ Response is not valid JSON:")
      console.log(text.substring(0, 300) + "...")
      return false
    }
  } catch (error) {
    console.error("❌ Error making API request:", error)
    return false
  }
}

async function main() {
  // 1. Check database connection
  const dbOk = await checkDatabase()

  if (!dbOk) {
    console.log("⚠️ Fix your database connection before proceeding")
  }

  // 2. Test API endpoints (add your endpoints here)
  console.log("\n--- Testing API Endpoints ---")

  // Test your specific endpoints
  await testApiEndpoint("http://localhost:3000/api/register")
  await testApiEndpoint("http://localhost:3000/api/check-email")

  console.log("\n--- Diagnostic Complete ---")
}

main().catch(console.error)
