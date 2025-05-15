/**
 * Enhanced API client for IoT Platform
 * - Adds better error handling
 * - Supports request cancellation
 * - Includes type safety
 */

type ApiResponse<T> = {
  data?: T
  error?: string
  status: number
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: any
  signal?: AbortSignal
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body, signal } = options

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      signal,
    })

    // Handle different response types
    let data
    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      data = await response.json()
    } else if (contentType?.includes("text/")) {
      data = await response.text()
    } else {
      // For binary data or other types
      data = await response.blob()
    }

    if (!response.ok) {
      return {
        error: data?.error || "An error occurred",
        status: response.status,
      }
    }

    return {
      data: data as T,
      status: response.status,
    }
  } catch (error: any) {
    // Handle network errors and aborted requests
    if (error.name === "AbortError") {
      return {
        error: "Request was cancelled",
        status: 499, // Client Closed Request
      }
    }

    return {
      error: error.message || "Network error",
      status: 0, // Network error
    }
  }
}

// Typed API methods
export const api = {
  get: <T = any>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body: any, options?: Omit<RequestOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = any>(endpoint: string, body: any, options?: Omit<RequestOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "PUT", body }),

  delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
}

// Create an abort controller for request cancellation
export function createRequestController() {
  return new AbortController()
}
