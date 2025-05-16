interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body = undefined, headers = {} } = options

  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    credentials: "include",
  }

  if (body) {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(endpoint, requestOptions)

    // Check if the response is JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      // Get the text to provide better error information
      const text = await response.text()
      throw new Error(
        `Expected JSON response but received ${contentType}. Status: ${response.status}. Response: ${text.substring(
          0,
          100,
        )}...`,
      )
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`)
    }

    return data as T
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}
