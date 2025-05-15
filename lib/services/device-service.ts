import { createServerClient } from "@/lib/supabase/server"
import { query } from "../db"
import { v4 as uuidv4 } from "uuid"

export interface Device {
  id: string
  name: string
  serial_number: string
  model: string | null
  manufacturer: string | null
  description: string | null
  status: string
  location: string | null
  latitude: number | null
  longitude: number | null
  firmware_version: string | null
  last_maintenance: Date | null
  last_reading_at: Date | null
  created_at: Date
  updated_at: Date
  user_id: string
  category_id: string | null
}

export interface DeviceReading {
  id: string
  device_id: string
  type: string
  value: number
  unit: string | null
  timestamp: Date
}

export type DeviceAlert = {
  id: string
  device_id: string
  title: string
  message: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "IGNORED"
  timestamp: string
  resolved_at?: string
  user_id: string
}

// Client-side device functions
// export const deviceService = {
//   // Get all devices for the current user
//   async getUserDevices() {
//     const { data, error } = await supabaseClient.from("devices").select("*").order("updated_at", { ascending: false })

//     if (error) throw new Error(error.message)
//     return data as Device[]
//   },

//   // Get a single device by ID
//   async getDevice(id: string) {
//     const { data, error } = await supabaseClient
//       .from("devices")
//       .select(`
//         *,
//         readings:device_readings(*, limit: 100, order: timestamp.desc),
//         alerts:device_alerts(*, limit: 10, order: timestamp.desc)
//       `)
//       .eq("id", id)
//       .single()

//     if (error) throw new Error(error.message)
//     return data as Device & { readings: DeviceReading[]; alerts: DeviceAlert[] }
//   },

//   // Create a new device
//   async createDevice(device: Omit<Device, "id" | "created_at" | "updated_at">) {
//     const { data, error } = await supabaseClient.from("devices").insert([device]).select()

//     if (error) throw new Error(error.message)
//     return data[0] as Device
//   },

//   // Update a device
//   async updateDevice(id: string, updates: Partial<Device>) {
//     const { data, error } = await supabaseClient.from("devices").update(updates).eq("id", id).select()

//     if (error) throw new Error(error.message)
//     return data[0] as Device
//   },

//   // Delete a device
//   async deleteDevice(id: string) {
//     const { error } = await supabaseClient.from("devices").delete().eq("id", id)

//     if (error) throw new Error(error.message)
//     return true
//   },

//   // Get device readings
//   async getDeviceReadings(deviceId: string, limit = 100) {
//     const { data, error } = await supabaseClient
//       .from("device_readings")
//       .select("*")
//       .eq("device_id", deviceId)
//       .order("timestamp", { ascending: false })
//       .limit(limit)

//     if (error) throw new Error(error.message)
//     return data as DeviceReading[]
//   },

//   // Add a device reading
//   async addDeviceReading(reading: Omit<DeviceReading, "id">) {
//     const { data, error } = await supabaseClient.from("device_readings").insert([reading]).select()

//     if (error) throw new Error(error.message)
//     return data[0] as DeviceReading
//   },

//   // Get device alerts
//   async getDeviceAlerts(deviceId: string, status?: string, limit = 20) {
//     let query = supabaseClient
//       .from("device_alerts")
//       .select("*")
//       .eq("device_id", deviceId)
//       .order("timestamp", { ascending: false })
//       .limit(limit)

//     if (status) {
//       query = query.eq("status", status)
//     }

//     const { data, error } = await query

//     if (error) throw new Error(error.message)
//     return data as DeviceAlert[]
//   },

//   // Create a device alert
//   async createAlert(alert: Omit<DeviceAlert, "id" | "timestamp">) {
//     const { data, error } = await supabaseClient
//       .from("device_alerts")
//       .insert([
//         {
//           ...alert,
//           timestamp: new Date().toISOString(),
//         },
//       ])
//       .select()

//     if (error) throw new Error(error.message)
//     return data[0] as DeviceAlert
//   },

//   // Update an alert
//   async updateAlert(id: string, updates: Partial<DeviceAlert>) {
//     const { data, error } = await supabaseClient.from("device_alerts").update(updates).eq("id", id).select()

//     if (error) throw new Error(error.message)
//     return data[0] as DeviceAlert
//   },

//   // Subscribe to device status changes
//   subscribeToDeviceStatus(deviceId: string, callback: (status: string) => void) {
//     const subscription = supabaseClient
//       .channel(`device-status-${deviceId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "devices",
//           filter: `id=eq.${deviceId}`,
//         },
//         (payload) => {
//           if (payload.new && payload.new.status) {
//             callback(payload.new.status as string)
//           }
//         },
//       )
//       .subscribe()

//     return () => {
//       supabaseClient.removeChannel(subscription)
//     }
//   },

//   // Subscribe to new device readings
//   subscribeToDeviceReadings(deviceId: string, callback: (reading: DeviceReading) => void) {
//     const subscription = supabaseClient
//       .channel(`device-readings-${deviceId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "device_readings",
//           filter: `device_id=eq.${deviceId}`,
//         },
//         (payload) => {
//           if (payload.new) {
//             callback(payload.new as DeviceReading)
//           }
//         },
//       )
//       .subscribe()

//     return () => {
//       supabaseClient.removeChannel(subscription)
//     }
//   },

//   // Subscribe to new device alerts
//   subscribeToDeviceAlerts(deviceId: string, callback: (alert: DeviceAlert) => void) {
//     const subscription = supabaseClient
//       .channel(`device-alerts-${deviceId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "device_alerts",
//           filter: `device_id=eq.${deviceId}`,
//         },
//         (payload) => {
//           if (payload.new) {
//             callback(payload.new as DeviceAlert)
//           }
//         },
//       )
//       .subscribe()

//     return () => {
//       supabaseClient.removeChannel(subscription)
//     }
//   },
// }

export const deviceService = {
  // Get all devices
  // async getAllDevices(): Promise<Device[]> {
  //   const result = await query("SELECT * FROM devices ORDER BY updated_at DESC")
  //   return result.rows
  // },

  // Get devices by user ID
  // async getDevicesByUserId(userId: string): Promise<Device[]> {
  //   const result = await query("SELECT * FROM devices WHERE user_id = $1 ORDER BY updated_at DESC", [userId])
  //   return result.rows
  // },

  // Get device by ID
  // async getDeviceById(id: string): Promise<Device | null> {
  //   const result = await query("SELECT * FROM devices WHERE id = $1", [id])
  //   return result.rows[0] || null
  // },

  // Create device
  // async createDevice(device: Omit<Device, "id" | "created_at" | "updated_at">): Promise<Device> {
  //   const {
  //     name,
  //     serial_number,
  //     model,
  //     manufacturer,
  //     description,
  //     status,
  //     location,
  //     latitude,
  //     longitude,
  //     firmware_version,
  //     last_maintenance,
  //     user_id,
  //     category_id,
  //   } = device

  //   const result = await query(
  //     `INSERT INTO devices (
  //       name, serial_number, model, manufacturer, description, status,
  //       location, latitude, longitude, firmware_version, last_maintenance, user_id, category_id
  //     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  //     RETURNING *`,
  //     [
  //       name,
  //       serial_number,
  //       model,
  //       manufacturer,
  //       description,
  //       status,
  //       location,
  //       latitude,
  //       longitude,
  //       firmware_version,
  //       last_maintenance,
  //       user_id,
  //       category_id,
  //     ],
  //   )

  //   return result.rows[0]
  // },

  // Update device
  // async updateDevice(id: string, updates: Partial<Device>): Promise<Device> {
  //   const fields = Object.keys(updates)
  //     .filter((key) => key !== "id" && key !== "created_at" && key !== "updated_at")
  //     .map((key, index) => `${key} = $${index + 1}`)

  //   const values = Object.values(updates).filter(
  //     (_, index) => fields[index] !== "id" && fields[index] !== "created_at" && fields[index] !== "updated_at",
  //   )

  //   if (fields.length === 0) {
  //     return this.getDeviceById(id) as Promise<Device>
  //   }

  //   const result = await query(
  //     `UPDATE devices SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
  //     [...values, id],
  //   )

  //   return result.rows[0]
  // },

  // Delete device
  // async deleteDevice(id: string): Promise<boolean> {
  //   const result = await query("DELETE FROM devices WHERE id = $1 RETURNING id", [id])
  //   return result.rowCount > 0
  // },

  // Get device readings
  // async getDeviceReadings(deviceId: string, limit = 100): Promise<DeviceReading[]> {
  //   const result = await query("SELECT * FROM device_readings WHERE device_id = $1 ORDER BY timestamp DESC LIMIT $2", [
  //     deviceId,
  //     limit,
  //   ])
  //   return result.rows
  // },

  // Add device reading
  // async addDeviceReading(reading: Omit<DeviceReading, "id">): Promise<DeviceReading> {
  //   const { device_id, type, value, unit, timestamp } = reading
  //   const result = await query(
  //     "INSERT INTO device_readings (device_id, type, value, unit, timestamp) VALUES ($1, $2, $3, $4, $5) RETURNING *",
  //     [device_id, type, value, unit, timestamp || new Date()],
  //   )
  //   return result.rows[0]
  // },

  // Get device statistics
  // async getDeviceStats(userId?: string): Promise<any> {
  //   // Base query for counting devices
  //   let deviceQuery = "SELECT COUNT(*) as total FROM devices"
  //   let deviceParams: any[] = []

  //   // If userId is provided, filter by user
  //   if (userId) {
  //     deviceQuery += " WHERE user_id = $1"
  //     deviceParams = [userId]
  //   }

  //   // Get total devices
  //   const totalDevicesResult = await query(deviceQuery, deviceParams)
  //   const totalDevices = Number.parseInt(totalDevicesResult.rows[0].total)

  //   // Get online devices
  //   let onlineQuery = "SELECT COUNT(*) as online FROM devices WHERE status = $1"
  //   const onlineParams = ["ONLINE"]

  //   // If userId is provided, add to filter
  //   if (userId) {
  //     onlineQuery += " AND user_id = $2"
  //     onlineParams.push(userId)
  //   }

  //   const onlineDevicesResult = await query(onlineQuery, onlineParams)
  //   const onlineDevices = Number.parseInt(onlineDevicesResult.rows[0].online)

  //   // Get device status counts
  //   let statusQuery = "SELECT status, COUNT(*) as count FROM devices"
  //   let statusParams: any[] = []

  //   // If userId is provided, filter by user
  //   if (userId) {
  //     statusQuery += " WHERE user_id = $1"
  //     statusParams = [userId]
  //   }

  //   statusQuery += " GROUP BY status"

  //   const statusResult = await query(statusQuery, statusParams)
  //   const deviceStatusCounts = statusResult.rows

  //   return {
  //     totalDevices,
  //     onlineDevices,
  //     deviceStatusCounts,
  //   }
  // },
  async getAllDevices(): Promise<Device[]> {
    return await query("SELECT * FROM devices ORDER BY created_at DESC")
  },

  async getDevicesByUserId(userId: string): Promise<Device[]> {
    const result = await query("SELECT * FROM devices WHERE user_id = $1 ORDER BY created_at DESC", [userId])
    return result.rows
  },

  async getDeviceById(id: string): Promise<Device | null> {
    const result = await query("SELECT * FROM devices WHERE id = $1", [id])
    return result.rows.length > 0 ? result.rows[0] : null
  },

  async createDevice(
    deviceData: Omit<Device, "id" | "created_at" | "updated_at" | "last_reading_at">,
  ): Promise<Device> {
    const id = uuidv4()

    const fields = Object.keys(deviceData)
    const placeholders = fields.map((_, i) => `$${i + 2}`).join(", ")
    const values = fields.map((field) => deviceData[field as keyof typeof deviceData])

    const result = await query(
      `INSERT INTO devices (id, ${fields.join(", ")}) VALUES ($1, ${placeholders}) RETURNING *`,
      [id, ...values],
    )

    return result.rows[0]
  },

  async updateDevice(id: string, data: Partial<Device>): Promise<Device | null> {
    const fields = Object.keys(data).filter((key) => key !== "id" && key !== "created_at")

    if (fields.length === 0) {
      return await this.getDeviceById(id)
    }

    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(", ")
    const values = fields.map((field) => data[field as keyof typeof data])

    const result = await query(`UPDATE devices SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`, [
      id,
      ...values,
    ])

    return result.rows.length > 0 ? result.rows[0] : null
  },

  async deleteDevice(id: string): Promise<boolean> {
    const result = await query("DELETE FROM devices WHERE id = $1 RETURNING id", [id])
    return result.rows.length > 0
  },

  async getDeviceReadings(deviceId: string, limit = 100): Promise<DeviceReading[]> {
    const result = await query("SELECT * FROM device_readings WHERE device_id = $1 ORDER BY timestamp DESC LIMIT $2", [
      deviceId,
      limit,
    ])
    return result.rows
  },

  async addDeviceReading(reading: Omit<DeviceReading, "id">): Promise<DeviceReading> {
    const id = uuidv4()

    const result = await query(
      "INSERT INTO device_readings (id, device_id, type, value, unit, timestamp) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id, reading.device_id, reading.type, reading.value, reading.unit, reading.timestamp || new Date()],
    )

    return result.rows[0]
  },

  async getDevicesByCategory(categoryId: string): Promise<Device[]> {
    const result = await query("SELECT * FROM devices WHERE category_id = $1 ORDER BY name", [categoryId])
    return result.rows
  },

  async getDeviceStats(): Promise<any> {
    const totalDevices = await query("SELECT COUNT(*) as count FROM devices")
    const devicesByStatus = await query("SELECT status, COUNT(*) as count FROM devices GROUP BY status")
    const devicesByCategory = await query(`
      SELECT c.name, COUNT(d.id) as count 
      FROM categories c 
      LEFT JOIN devices d ON c.id = d.category_id 
      GROUP BY c.name
    `)

    return {
      totalDevices: Number.parseInt(totalDevices[0].count),
      devicesByStatus: devicesByStatus.rows,
      devicesByCategory: devicesByCategory.rows,
    }
  },
}

// Server-side device functions
export const serverDeviceService = {
  // Get all devices (admin only)
  async getAllDevices() {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("devices").select("*").order("updated_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data as Device[]
  },

  // Get devices for a specific user
  async getUserDevices(userId: string) {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data as Device[]
  },

  // Get device statistics
  async getDeviceStats() {
    const supabase = createServerClient()

    // Get total devices
    const { count: totalDevices, error: countError } = await supabase
      .from("devices")
      .select("*", { count: "exact", head: true })

    if (countError) throw new Error(countError.message)

    // Get online devices
    const { count: onlineDevices, error: onlineError } = await supabase
      .from("devices")
      .select("*", { count: "exact", head: true })
      .eq("status", "ONLINE")

    if (onlineError) throw new Error(onlineError.message)

    // Get total alerts
    const { count: totalAlerts, error: alertsError } = await supabase
      .from("device_alerts")
      .select("*", { count: "exact", head: true })
      .eq("status", "ACTIVE")

    if (alertsError) throw new Error(alertsError.message)

    // Get readings in last 24 hours
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const { count: readings24h, error: readingsError } = await supabase
      .from("device_readings")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", oneDayAgo.toISOString())

    if (readingsError) throw new Error(readingsError.message)

    return {
      totalDevices: totalDevices || 0,
      onlineDevices: onlineDevices || 0,
      totalAlerts: totalAlerts || 0,
      readings24h: readings24h || 0,
    }
  },
}
